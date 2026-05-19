import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { getConfig } from '../../config';

export function initializeJwtRefreshStrategy() {
  const config = getConfig();

  passport.use(
    'jwt-refresh',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.cookies?.refresh_token ?? null]),
        ignoreExpiration: false,
        secretOrKey: config.jwt.refreshSecret,
        passReqToCallback: true,
      },
      (req: Request, payload: { sub: string }, done) => {
        const refreshToken = req.cookies?.refresh_token;
        return done(null, { userId: payload.sub, refreshToken });
      }
    )
  );
}
