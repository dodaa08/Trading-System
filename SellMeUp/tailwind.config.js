/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        moveBackAndForth: 'moveBackAndForth 1s ease-in-out infinite',
        flip: 'flip 1s ease-in-out',
      },
      keyframes: {
        moveBackAndForth: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        },
        flip: {
          '0%': { transform: 'rotateX(0)' },
          '50%': { transform: 'rotateX(180deg)' },
          '100%': { transform: 'rotateX(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
