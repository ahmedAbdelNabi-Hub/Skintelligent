module.exports = {
  content: [
    "./src/**/*.{html,ts,css,scss}", // Ensure it scans TypeScript and HTML files
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
