module.exports = {
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:5500/src',  // Changez ici - ajoutez /src
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  },
  webServer: {
    command: 'echo "Using external Live Server"',  // On n'utilise pas la commande
    port: 5500,  // Port de Live Server
    timeout: 120 * 1000,
    reuseExistingServer: true  // Important : utilise le serveur existant
  }
};