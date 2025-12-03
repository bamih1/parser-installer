const axios = require('axios');
const cheerio = require('cheerio');

async function parseWithCheerio(url, selectors, options = {}) {
  const { limit = 50, delay = 500, userAgent, categoryFilter = null } = options;
  const headers = userAgent ? { 'User-Agent': userAgent } : {};

  try {
    const response = await axios.get(url, { headers, timeout: 15000 });
    const $ = cheerio.load(response.data);
    const products = [];
    const productElements = $(selectors.products).slice(0, limit * 2);

    productElements.each((idx, elem) => {
      const $elem = $(elem);

      if (categoryFilter) {
        const category = $elem.attr('data-category') || $elem.data('category');
        if (category !== categoryFilter) return;
      }

      const product = {
        name: $elem.find(selectors.name).text().trim() || null,
        price: $elem.find(selectors.price).text().trim() || null,
        composition: $elem.find(selectors.composition).text().trim() || null,
        discount: $elem.find(selectors.discount).text().trim() || null,
        category: $elem.attr('data-category') || $elem.data('category') || null,
        url: $elem.find('a').attr('href') || null,
      };

      if (product.price) {
        product.price = product.price.replace(/\s+/g, ' ').replace(/[^\d.,\s₽$€]/g, '').trim();
      }

      products.push(product);

      if (products.length >= limit) return false;
    });

    return { products, itemsCount: products.length };
  } catch (error) {
    throw new Error(`Cheerio parsing error: ${error.message}`);
  }
}

module.exports = { parseWithCheerio };
