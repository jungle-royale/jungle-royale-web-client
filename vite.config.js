import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, './');

  console.log("Loaded VITE_API_BASE_URL:", env.VITE_API_BASE_URL); // 디버깅용 출력
  console.log("Loaded VITE_KAKAO_REDIRECT_URL", env.VITE_KAKAO_REDIRECT_URL)

  return {
    plugins: [react()],
    publicDir: 'public', // 기본 설정
    server: {
      host: '0.0.0.0',
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      'import.meta.env.VITE_KAKAO_REDIRECT_URL': JSON.stringify(env.VITE_KAKAO_REDIRECT_URL),
      global: 'window',

    },
  };
});
