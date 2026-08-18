import { getDatabase } from '../db/database.js';

export async function getUserWallet(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.id;

    const user = db.prepare(`
      SELECT wallet_balance, upi_id, bank_name
      FROM users
      WHERE id = ?
    `).get(userId);

    const transactions = db.prepare(`
      SELECT id, title, type, amount, payment_method as paymentMethod, status, created_at as date
      FROM transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(userId);

    res.json({
      success: true,
      walletBalance: user ? user.wallet_balance : 0.0,
      upiId: user ? user.upi_id : '',
      bankName: user ? user.bank_name : '',
      transactions
    });
  } catch (error) {
    next(error);
  }
}

export async function depositFunds(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    const { amount, paymentMethod } = req.body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deposit amount.'
      });
    }

    // Atomic SQLite Transaction
    const depositTx = db.transaction(() => {
      db.prepare(`
        UPDATE users
        SET wallet_balance = wallet_balance + ?
        WHERE id = ?
      `).run(numAmount, userId);

      const title = `Deposit via ${paymentMethod || 'UPI / GPay'}`;
      const txResult = db.prepare(`
        INSERT INTO transactions (user_id, title, type, amount, payment_method, status)
        VALUES (?, ?, 'credit', ?, ?, 'Completed')
      `).run(userId, title, numAmount, paymentMethod || 'UPI');

      const updatedUser = db.prepare('SELECT wallet_balance FROM users WHERE id = ?').get(userId);
      const newTx = db.prepare('SELECT id, title, type, amount, payment_method as paymentMethod, status, created_at as date FROM transactions WHERE id = ?').get(txResult.lastInsertRowid);

      return { newBalance: updatedUser.wallet_balance, transaction: newTx };
    });

    const result = depositTx();

    res.json({
      success: true,
      message: 'Deposit successful',
      walletBalance: result.newBalance,
      transaction: result.transaction
    });
  } catch (error) {
    next(error);
  }
}

export async function withdrawFunds(req, res, next) {
  try {
    const db = getDatabase();
    const userId = req.user.id;
    const { amount } = req.body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid withdrawal amount.'
      });
    }

    const user = db.prepare('SELECT wallet_balance, bank_name FROM users WHERE id = ?').get(userId);
    if (!user || user.wallet_balance < numAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance for this withdrawal.'
      });
    }

    // Atomic SQLite Transaction
    const withdrawTx = db.transaction(() => {
      db.prepare(`
        UPDATE users
        SET wallet_balance = wallet_balance - ?
        WHERE id = ?
      `).run(numAmount, userId);

      const title = `Withdrawal to ${user.bank_name || 'Bank Account'}`;
      const txResult = db.prepare(`
        INSERT INTO transactions (user_id, title, type, amount, payment_method, status)
        VALUES (?, ?, 'debit', ?, 'Bank Transfer', 'Completed')
      `).run(userId, title, numAmount);

      const updatedUser = db.prepare('SELECT wallet_balance FROM users WHERE id = ?').get(userId);
      const newTx = db.prepare('SELECT id, title, type, amount, payment_method as paymentMethod, status, created_at as date FROM transactions WHERE id = ?').get(txResult.lastInsertRowid);

      return { newBalance: updatedUser.wallet_balance, transaction: newTx };
    });

    const result = withdrawTx();

    res.json({
      success: true,
      message: 'Withdrawal successful',
      walletBalance: result.newBalance,
      transaction: result.transaction
    });
  } catch (error) {
    next(error);
  }
}
