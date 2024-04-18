const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/integration/**/*.*',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    setupNodeEvents(on, config) {

    },
    baseUrl: 'http://localhost:3000',
    
  },
});
