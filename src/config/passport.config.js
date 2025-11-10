import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import prisma from "./prisma.config.js";
import { generateTokens } from "../api/services/auth.service.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google profile"), null);

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              nick_name: profile.displayName || "GoogleUser",
              password: "",
              role: "USER",
              provider: "GOOGLE",
              refresh_token: "",
            },
          });
        }

        const { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } =
          await generateTokens(user);

        return done(null, { user, jwtAccessToken, jwtRefreshToken });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;