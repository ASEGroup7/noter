import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    video: true, // Enable video recording
    videoCompression: 32, // Set the compression level (0 to 51)
    videosFolder: 'cypress/videos', // Specify the folder to save videos
    // Additional configuration options can be added here
  },
});
