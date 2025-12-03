const puppeteer = require('puppeteer');

async function parseWithPuppeteer(url, selectors, options = {}) {
  const { limit = 50, userAgent, categoryFilter = null } = options;
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    if (userAgent) {
      await page.setUserAgent(userAgent);
    }

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector(selectors.products, { timeout: 10000 }).catch(() => {});

    const products = await page.evaluate((sels, lim, catFilter) => {
      const results = [];
      const elements = document.querySelectorAll(sels.products);

      for (let i = 0; i < Math.min(elements.length, lim * 2); i++) {
        const elem = elements[i];

        if (catFilter) {
          const category = elem.dataset.category || elem.getAttribute('data-category');
          if (category !== catFilter) continue;
        }

        const product = {
          name: elem.querySelector(sels.name)?.innerText?.trim() || null,
          price: elem.querySelector(sels.price)?.innerText?.trim() || null,
          composition: elem.querySelector(sels.composition)?.innerText?.trim() || null,
          discount: elem.querySelector(sels.discount)?.innerText?.trim() || null,
          category: elem.dataset.category || elem.getAttribute('data-category') || null,
          url: elem.querySelector('a')?.href || null,
        };

        results.push(product);

        if (results.length >= lim) break;
      }

      return results;
    }, selectors, limit, categoryFilter);

    await browser.close();

    return { products, itemsCount: products.length };
  } catch (error) {
    if (browser) await browser.close();
    throw new Error(`Puppeteer parsing error: ${error.message}`);
  }
}

module.exports = { parseWithPuppeteer };
