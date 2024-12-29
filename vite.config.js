// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig(({ mode }) => {
//   // 환경 변수 로드 (process.cwd() 없이 간단히 사용)
//   const env = loadEnv(mode, './'); // './'는 현재 디렉토리를 나타냄

//   console.log("Loaded environment variables:", env);

//   return {
//     plugins: [react()],
//     server: {
//       host: '0.0.0.0',
//     },
//     define: {
//       'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
//     },
//   };
// });
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, './');

  console.log("Loaded VITE_API_URL:", env.VITE_API_URL); // 디버깅용 출력

  return {
    plugins: [react()],
    publicDir: 'public', // 기본 설정
    server: {
      host: '0.0.0.0',
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
  };
});
