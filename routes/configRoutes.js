const express = require('express');
const { v4: uuidv4 } = require('uuid');

function configRoutes(db) {
  const router = express.Router();

  router.post('/config/save', (req, res) => {
    const { name, domain, config } = req.body;

    if (!name || !domain || !config) {
      return res.status(400).json({ status: 'error', error: 'Missing fields' });
    }

    const id = uuidv4();
    db.run(
      'INSERT INTO configs (id, name, domain, config) VALUES (?, ?, ?, ?)',
      [id, name, domain, JSON.stringify(config)],
      (err) => {
        if (err) {
          return res.status(500).json({ status: 'error', error: err.message });
        }
        res.json({ status: 'success', id });
      }
    );
  });

  router.get('/configs', (req, res) => {
    db.all('SELECT id, name, domain, config FROM configs ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        return res.status(500).json({ status: 'error', error: err.message });
      }

      const configs = rows.map((row) => ({
        id: row.id,
        name: row.name,
        domain: row.domain,
        config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
      }));

      res.json({ status: 'success', configs });
    });
  });

  return router;
}

module.exports = configRoutes;
