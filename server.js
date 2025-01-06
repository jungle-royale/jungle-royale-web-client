import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import log from 'loglevel';


const app = express();

// 현재 파일의 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'dist')));

// SPA 라우팅 지원
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 서버 포트 설정
const PORT = import.meta.env.PORT || 3000;
app.listen(PORT, () => {
  log.info(`Server is running on http://localhost:${PORT}`);
});