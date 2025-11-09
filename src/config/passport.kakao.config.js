import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import dotenv from "dotenv";
import prisma from "./prisma.config.js";
import { generateTokens } from "../api/services/auth.service.js";

dotenv.config();

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile._json?.kakao_account?.email ||
          `${profile.id}@kakao.com`;

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              nick_name: profile.displayName || "KakaoUser",
              password: "",
              role: "USER",
              provider: "KAKAO",
              refresh_token: "",
            },
          });
        }

        const { accessToken: jwtAccessToken, refreshToken: jwtRefreshToken } =
          await generateTokens(user);

        return done(null, { user, jwtAccessToken, jwtRefreshToken });
      } catch (err) {
        console.error("Kakao OAuth Error:", err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
