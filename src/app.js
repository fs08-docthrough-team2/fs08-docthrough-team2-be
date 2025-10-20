import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import sampleRoutes from './routes/sample.Routes.js';

import { swaggerDocs } from './common/swagger.js';
// 환경 변수 설정
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  if (!process.env.DATABASE_URL) {
    console.error('[ENV] DATABASE_URL 로드 실패');
  }
}

const app = express();

// express 미들웨어 설정
app.use(express.json({ limit: '1mb' })); // JSON 파싱 미들웨어 추가
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(morgan('combined'));
app.use(cookieParser());

// API 라우트 설정
app.get('/', (req, res) => {
  res.send('API 연결 성공');
});
app.use('/api/sample', sampleRoutes);


// Swagger 문서
swaggerDocs(app);

// 서버 실행
const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});