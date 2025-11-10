import cors from 'cors';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const corsOptions = {
  origin: ['http://localhost:3000', 'https://fs08-docthrough.onrender.com', 'https://fs08-docthrough-team2-fe.vercel.app/'], // 허용할 도메인
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // 허용할 HTTP 메서드
  allowedHeaders: ['Content-Type', 'Authorization', 'x-study-password'], // 허용할 헤더
  credentials: true, // 쿠키 인증을 사용함
  optionsSuccessStatus: 200, // 일부 브라우저 호환용
};

export default cors(corsOptions);
