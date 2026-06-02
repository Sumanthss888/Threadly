const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  await page.goto('http://localhost:5173/');
  
  // Inject mock token
  await page.evaluate(() => {
    localStorage.setItem('token', 'mock_token_123');
  });
  
  // Reload to trigger Home page
  await page.reload();
  
  // wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));
  await browser.close();
})();
