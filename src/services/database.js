import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('cookpal.db');

export const initDB = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT UNIQUE,
        password TEXT
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const registerUserInDB = async (username, email, password) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      username, email, password
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const loginUserInDB = async (email, password) => {
  try {
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      email, password
    );
    return user;
  } catch (error) {
    throw error;
  }
};


export const updateUserInDB = async (id, newUsername, newPassword) => {
  try {
    if (newPassword) {
      // Update both username and password
      await db.runAsync(
        'UPDATE users SET username = ?, password = ? WHERE id = ?',
        newUsername, newPassword, id
      );
    } else {
      // Update only username
      await db.runAsync(
        'UPDATE users SET username = ? WHERE id = ?',
        newUsername, id
      );
    }
  } catch (error) {
    throw error;
  }
};