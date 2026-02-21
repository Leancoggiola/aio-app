import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { Response } from 'express';
import { StringValue } from 'ms';

import { UsersService } from '../users/users.service';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;
  private readonly cookieMaxAge: number; // milliseconds
  private readonly isProduction: boolean;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {
    this.accessSecret = this.configService.getOrThrow('JWT_ACCESS_SECRET');
    this.refreshSecret = this.configService.getOrThrow('JWT_REFRESH_SECRET');
    this.accessExpiresIn =
      this.configService.get('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    this.refreshExpiresIn =
      this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    this.cookieMaxAge =
      (parseInt(this.configService.get('COOKIE_REFRESH_MAX_AGE') ?? '604800', 10)) * 1000;
    this.isProduction =
      this.configService.get('NODE_ENV') === 'production';
  }

  // ─── Register ───────────────────────────────────────────────

  async register(dto: RegisterDto, res: Response) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    await this.issueTokens(
      { sub: user._id.toString(), email: user.email },
      res,
    );

    return {
      user: this.sanitizeUser(user),
    };
  }

  // ─── Validate (for LocalStrategy) ──────────────────────────

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return this.sanitizeUser(user);
  }

  // ─── Login ─────────────────────────────────────────────────

  async login(user: { _id: string; email: string }, res: Response) {
    await this.issueTokens(
      { sub: user._id.toString(), email: user.email },
      res,
    );

    return { user };
  }

  // ─── Refresh ───────────────────────────────────────────────

  async refresh(userId: string, rawRefreshToken: string, res: Response) {
    // Find all refresh tokens for this user
    const storedTokens = await this.refreshTokenModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();

    // Find the matching token by comparing hashes
    let matchedToken: RefreshTokenDocument | null = null;
    for (const token of storedTokens) {
      const isMatch = await bcrypt.compare(rawRefreshToken, token.tokenHash);
      if (isMatch) {
        matchedToken = token;
        break;
      }
    }

    if (!matchedToken) {
      // Possible token theft: revoke ALL sessions for this user
      await this.refreshTokenModel.deleteMany({
        userId: new Types.ObjectId(userId),
      });
      this.clearCookies(res);
      throw new UnauthorizedException(
        'Refresh token not recognized. All sessions revoked.',
      );
    }

    // Delete the used token (rotation)
    await this.refreshTokenModel.findByIdAndDelete(matchedToken._id);

    // Get user data
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Issue new tokens
    await this.issueTokens({ sub: userId, email: user.email }, res);

    return {
      user: this.sanitizeUser(user),
    };
  }

  // ─── Logout ────────────────────────────────────────────────

  async logout(userId: string, rawRefreshToken: string, res: Response) {
    // Find and delete the specific refresh token
    const storedTokens = await this.refreshTokenModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();

    for (const token of storedTokens) {
      const isMatch = await bcrypt.compare(rawRefreshToken, token.tokenHash);
      if (isMatch) {
        await this.refreshTokenModel.findByIdAndDelete(token._id);
        break;
      }
    }

    this.clearCookies(res);

    return { message: 'Logged out successfully' };
  }

  // ─── Profile ───────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { user: this.sanitizeUser(user) };
  }

  // ─── Private helpers ──────────────────────────────────────

  private async issueTokens(
    payload: { sub: string; email: string },
    res: Response,
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.accessSecret,
        expiresIn: this.accessExpiresIn as StringValue,
      }),
      this.jwtService.signAsync(
        { sub: payload.sub },
        {
          secret: this.refreshSecret,
          expiresIn: this.refreshExpiresIn as StringValue,
        },
      ),
    ]);

    // Hash the refresh token before storing in DB
    const tokenHash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);

    // Calculate expiration date
    const expiresAt = new Date(Date.now() + this.cookieMaxAge);

    await this.refreshTokenModel.create({
      userId: new Types.ObjectId(payload.sub),
      tokenHash,
      expiresAt,
    });

    // Set cookies
    this.setAccessCookie(res, accessToken);
    this.setRefreshCookie(res, refreshToken);
  }

  private setAccessCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/api',
      maxAge: 15 * 60 * 1000, // 15 minutes in ms
    });
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: this.cookieMaxAge,
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/api',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: 'strict',
      path: '/api/auth/refresh',
    });
  }

  private sanitizeUser(user: any) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    delete obj.__v;
    return obj;
  }
}
