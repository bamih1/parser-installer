const express = require('express');
const cors = require('cors');
const initDb = require('./db');
const parseRoutes = require('./routes/parseRoutes');
const configRoutes = require('./routes/configRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const db = initDb();

app.use('/api', parseRoutes(db));
app.use('/api', configRoutes(db));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Parser server running on http://localhost:${PORT}`);
});