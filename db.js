const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function initDb() {
  const dbPath = path.join(__dirname, 'parser.db');
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS configs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT NOT NULL,
      config TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS results (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      config_name TEXT,
      data TEXT NOT NULL,
      status TEXT,
      execution_time INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });

  return db;
}

module.exports = initDb;
