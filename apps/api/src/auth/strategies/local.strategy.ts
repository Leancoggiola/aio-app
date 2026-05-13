import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as authService from "../auth.service";

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await authService.validateUser(email, password);
        if (!user) return done(null, false, { message: "Invalid credentials" });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
