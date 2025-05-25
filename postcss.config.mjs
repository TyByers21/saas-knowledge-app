/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "postcss-import": {}, // Must come first
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
