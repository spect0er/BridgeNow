import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../db/database.js';
import { config } from '../config/env.js';

// Format user payload (omits sensitive fields)
function formatUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role || 'creator',
    avatar: row.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=863bff&color=fff`,
    created_at: row.created_at
  };
}

// Validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Helper to set deployment cookie
function setAuthCookie(res, token) {
  const maxAge = config.cookieMaxAgeDays * 24 * 60 * 60 * 1000;
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name must be at least 2 characters.' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = getDatabase();

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);
    const userRole = role || 'creator';
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=863bff&color=fff`;

    const result = db.prepare(`
      INSERT INTO users (name, email, password, role, avatar)
      VALUES (?, ?, ?, ?, ?)
    `).run(name.trim(), cleanEmail, hashedPassword, userRole, avatar);

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    const formattedUser = formatUser(newUser);

    const token = jwt.sign(
      { id: formattedUser.id, email: formattedUser.email, role: formattedUser.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Set deployment HttpOnly cookie if supported
    if (res.cookie) {
      setAuthCookie(res, token);
    }

    console.log(`[Deployment Auth] Registered new user: ${formattedUser.email} (ID: ${formattedUser.id})`);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: formattedUser
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = getDatabase();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const formattedUser = formatUser(user);

    const token = jwt.sign(
      { id: formattedUser.id, email: formattedUser.email, role: formattedUser.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    if (res.cookie) {
      setAuthCookie(res, token);
    }

    console.log(`[Deployment Auth] Logged in user: ${formattedUser.email} (ID: ${formattedUser.id})`);

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: formattedUser
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    return res.json({
      success: true,
      user: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyToken(req, res, next) {
  try {
    const db = getDatabase();
    const user = db.prepare('SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(401).json({ success: false, valid: false, error: 'Token user no longer exists.' });
    }

    return res.json({
      success: true,
      valid: true,
      user: formatUser(user),
      expiresAt: new Date(req.user.exp * 1000).toISOString()
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  if (res.clearCookie) {
    res.clearCookie('token');
  }
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
}
