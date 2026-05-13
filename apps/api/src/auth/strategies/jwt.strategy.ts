import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
import { config } from "../../config";

export interface JwtPayload {
  sub: string;
  email: string;
}

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.access_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.jwt.accessSecret,
    },
    (payload: JwtPayload, done) => {
      return done(null, { userId: payload.sub, email: payload.email });
    },
  ),
);
