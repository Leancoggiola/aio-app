export default {
  "apps/**/*.{ts,tsx}": ["eslint --fix"],
  "packages/**/*.{ts,tsx}": ["eslint --fix"],
  "*.{ts,tsx,json,md,css,scss,mjs}": ["prettier --write"],
};
