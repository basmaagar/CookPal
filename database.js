import * as SQLite from 'expo-sqlite';

// Ouvre ou crée la base de données
const db = SQLite.openDatabaseSync('auth.db');

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      handle TEXT
    );
  `);
};

export const findUser = (email, password) => {
  return db.getFirstSync(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  );
};

export const createUser = (name, email, password, handle) => {
  db.runSync(
    'INSERT INTO users (name, email, password, handle) VALUES (?, ?, ?, ?)',
    [name, email, password, handle]
  );
};

export const findUserByEmail = (email) => {
  return db.getFirstSync(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
};
