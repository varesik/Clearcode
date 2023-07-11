const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: '**/*.spec.{js,jsx,ts,tsx}',
    baseUrl: 'https://clearcodehq.github.io/qa-intern-test/#'
  },
});