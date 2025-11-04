// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Docthrough API",
      version: "1.0.0",
      description: "독스루 API 문서",
    },
    servers: [
      { url: "http://localhost:3000", description: "개발 서버" },
      { url: "https://fs08-docthrough.onrender.com", description: "운영 서버" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Access Token을 입력하세요. 예시: Bearer eyJhbGciOiJIUzI1NiIs...",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
          description: "Refresh Token (Swagger에서 쿠키 테스트 시 필요)",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
        cookieAuth: [],
      },
    ],
  },
  apis: [path.resolve(__dirname, "../swagger/*.js")], // JSDoc 기반 문서 생성
};


const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📄 Swagger UI: http://localhost:3000/api-docs');
  console.log('📄 Swagger UI: https://fs08-docthrough.onrender.com/api-docs');
}
