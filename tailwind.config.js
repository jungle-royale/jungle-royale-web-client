import forms from '@tailwindcss/forms';
import tailwindScrollbarHide from 'tailwind-scrollbar-hide';
import defaultTheme from 'tailwindcss/defaultTheme';
// import typography from '@tailwindcss/typography';
// import aspectRatio from '@tailwindcss/aspect-ratio';

/* @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['"VT323"', 'monospace'], // 픽셀 스타일 폰트
        bagel: ['"Bagel Fat One"', 'cursive'], // 새로 추가한 폰트
        noto: ['"Noto Sans KR"', 'sans-serif'], // Noto Sans KR 추가
        'yonepick': ['"YOnepick"', ...defaultTheme.fontFamily.sans],

      },
      colors: {
        gradientStart: "#1e3a8a", // 어두운 파란색
        gradientEnd: "#60a5fa", // 밝은 파란색
      },
    },
  },
  plugins: [
    forms, // 플러그인 추가
    tailwindScrollbarHide, // 플러그인 설치 후 적용
    function ({ addUtilities }) {
      addUtilities({
        '.drag-none': {
          '-webkit-user-drag': 'none',
          'user-drag': 'none',
        },
      });
    },
  ],
};
