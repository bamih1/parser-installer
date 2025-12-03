const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { parseWithCheerio } = require('../parsers/cheerioParser');
const { parseWithPuppeteer } = require('../parsers/puppeteerParser');

function parseRoutes(db) {
  const router = express.Router();

  router.post('/parse-custom', async (req, res) => {
    const {
      url,
      selectors,
      limit = 50,
      delay = 500,
      userAgent,
      browser = false,
      categoryFilter,
    } = req.body;

    if (!url || !selectors?.products) {
      return res.status(400).json({ status: 'error', error: 'URL and selectors.products required' });
    }

    const startTime = Date.now();
    const resultId = uuidv4();

    try {
      let result;

      if (browser === true || browser === 'true') {
        result = await parseWithPuppeteer(url, selectors, { limit, userAgent, categoryFilter });
      } else {
        result = await parseWithCheerio(url, selectors, { limit, delay, userAgent, categoryFilter });
      }

      const executionTime = Date.now() - startTime;

      db.run(
        'INSERT INTO results (id, url, data, status, execution_time) VALUES (?, ?, ?, ?, ?)',
        [resultId, url, JSON.stringify(result.products), 'success', executionTime]
      );

      res.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        data: {
          url,
          itemsCount: result.itemsCount,
          products: result.products.slice(0, limit),
          executionTime,
          categoryFilter,
        },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
  });

  router.get('/results/:id', (req, res) => {
    db.get('SELECT * FROM results WHERE id = ?', [req.params.id], (err, row) => {
      if (err || !row) {
        return res.status(404).json({ status: 'error', error: 'Result not found' });
      }
      res.json({
        status: 'success',
        data: {
          ...row,
          data: JSON.parse(row.data),
        },
      });
    });
  });

  return router;
}

module.exports = parseRoutes;
