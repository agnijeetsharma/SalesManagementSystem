// frontend/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f8fafa",
          100: "#f0f6f6",
          400: "#0ea5a3"
        }
      }
    }
  },
  plugins: [],
};
