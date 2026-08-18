import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

let db = null;

export function getDatabase() {
  if (db) return db;

  db = new Database(config.dbPath);

  // Performance & Integrity Pragmas
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');

  // Schema Initialization & Migration
  initSchema(db);

  return db;
}

function initSchema(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'creator',
      avatar TEXT,
      wallet_balance REAL DEFAULT 0.0,
      upi_id TEXT,
      bank_name TEXT,
      bio TEXT,
      location TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

    CREATE TABLE IF NOT EXISTS gigs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT DEFAULT 'Sponsorship',
      budget REAL NOT NULL,
      progress INTEGER DEFAULT 0,
      status TEXT DEFAULT 'In Progress',
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_gigs_user_id ON gigs(user_id);

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL, -- 'credit' or 'debit'
      amount REAL NOT NULL,
      payment_method TEXT,
      status TEXT DEFAULT 'Completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
  `);

  // Migration: Add columns to users table if they were missing in existing DB
  const columns = database.prepare("PRAGMA table_info(users)").all();
  const colNames = columns.map(c => c.name);

  if (!colNames.includes('wallet_balance')) {
    database.exec("ALTER TABLE users ADD COLUMN wallet_balance REAL DEFAULT 0.0");
  }
  if (!colNames.includes('upi_id')) {
    database.exec("ALTER TABLE users ADD COLUMN upi_id TEXT");
  }
  if (!colNames.includes('bank_name')) {
    database.exec("ALTER TABLE users ADD COLUMN bank_name TEXT");
  }
  if (!colNames.includes('bio')) {
    database.exec("ALTER TABLE users ADD COLUMN bio TEXT");
  }
  if (!colNames.includes('location')) {
    database.exec("ALTER TABLE users ADD COLUMN location TEXT");
  }
  if (!colNames.includes('phone')) {
    database.exec("ALTER TABLE users ADD COLUMN phone TEXT");
  }

  // Auto-seed demo user if database is empty
  const userCount = database.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('password123', config.bcryptSaltRounds);
    database.prepare(`
      INSERT INTO users (name, email, password, role, avatar, wallet_balance, upi_id, bank_name, bio, location, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Karan Sharma',
      'demo@bridgenow.com',
      hashedPassword,
      'creator',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150',
      0.0,
      'karan@okaxis',
      'BridgeNow SFB - ****4321',
      'High-energy tech creator & video producer.',
      'Mumbai, India',
      '+91 98765 43210'
    );
    console.log('[Database] System initialized & seeded with default demo user (demo@bridgenow.com).');
  }
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('[Database] SQLite database connection closed safely.');
  }
}
