// 각종 라이브러리 임포트
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

// 라우트 임포트
import authRoutes  from "./api/routes/auth.route.js"
import tokenRoutes from "./api/routes/token.route.js"
import adminRoutes from "./api/routes/admin.route.js"
import userRoutes from "./api/routes/user.route.js"

import challengeAdminRoute from './api/routes/challenge.admin.route.js';
import challengeInquiryRoute from './api/routes/challenge.inquiry.route.js';
import challengeCRUDRoute from './api/routes/challenge.crud.route.js'

import noticeRoute from './api/routes/notice.route.js';
import challengeworkRoute from "./api/routes/challenge.work.route.js"; 

import challengeFeedbackRoute from "./api/routes/challenge.feedback.route.js"

// 공통 미들웨어 임포트
import { errorHandler } from './common/error.js';
import { swaggerDocs } from './common/swagger.js';
import cors from './common/cors.js';
import prisma from './common/prisma.js';

// 환경 변수 설정
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  if (!process.env.DATABASE_URL) {
    console.error('[ENV] DATABASE_URL 로드 실패');
  }
}

// Express 앱 생성
const app = express();

// express 미들웨어 설정
app.use(express.json({ limit: '10mb' })); // JSON 파싱 미들웨어 추가
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(cors);

// API 라우트 설정
app.get('/', (req, res) => {
  res.send('API 연결 성공');
});

app.use('/api/challenge/admin', challengeAdminRoute)
app.use('/api/challenge/inquiry', challengeInquiryRoute);
app.use('/api/challenge', challengeCRUDRoute);
app.use('/api/notice', noticeRoute);

app.use('/api/challenge/work', challengeworkRoute);
app.use('/api/challenge/feedback', challengeFeedbackRoute);
app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Swagger 문서
swaggerDocs(app);

// 에러 핸들링 미들웨어 설정
app.use(errorHandler);

// 서버 실행
const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    // 데이터베이스 연결 테스트
    await prisma.$connect();
    console.log('✅ Database connected');

    // 서버 연결 테스트 엔드포인트
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString()
      });
    });
  } catch (error) {
    console.error('❌ Startup error:', error);
    throw error;
  }
});

// 처리되지 않은 에러 캐치
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
