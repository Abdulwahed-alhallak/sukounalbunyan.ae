import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://noble.dion.sy',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 30000,
    responseTimeout: 15000,
    video: true,
    screenshotOnRunFailure: true,
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    retries: {
      runMode: 1,
      openMode: 0
    },
    env: {
      // Use runtime environment variables for live credentials.
      adminEmail: process.env.CYPRESS_ADMIN_EMAIL || 'admin@noblearchitecture.net',
      adminPassword: process.env.CYPRESS_ADMIN_PASSWORD || '',
      baseApiUrl: 'https://noble.dion.sy',
    }
  },
})
