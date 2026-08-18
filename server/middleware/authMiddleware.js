import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// Helper to parse cookies from raw Cookie header
function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  return list;
}

export function authenticateToken(req, res, next) {
  let token = null;

  // 1. Extract from Authorization header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Fallback to Cookie header (Deployment / HttpOnly Cookies)
  if (!token && req.headers.cookie) {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies.token || cookies.bn_auth_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'NO_TOKEN_PROVIDED',
      error: 'Access denied. Authorization token is required for deployment access.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    req.rawToken = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        error: 'Authorization session has expired. Please sign in again.'
      });
    }
    return res.status(401).json({
      success: false,
      code: 'TOKEN_INVALID',
      error: 'Invalid or tampered authorization token.'
    });
  }
}
