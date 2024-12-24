/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html","./index.js"],
  theme: {
    extend: {
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },




    },
  },
  plugins: [],
}

