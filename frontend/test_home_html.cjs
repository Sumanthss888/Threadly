const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/');
  
  await page.evaluate(() => {
    localStorage.setItem('token', 'mock_token_123');
  });
  
  await page.reload();
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mainHtml = await page.evaluate(() => {
    const main = document.querySelector('main');
    return main ? main.innerHTML : 'No main tag found';
  });
  
  console.log('MAIN HTML:', mainHtml);
  await browser.close();
})();
