import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple native .env loader for deployment & dev environments
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '..', '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...values] = trimmed.split('=');
          const val = values.join('=').trim().replace(/^["']|["']$/g, '');
          if (key && !process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      });
    } catch (e) {
      console.warn('[Config] Notice: Could not parse local .env file.');
    }
  }
}

loadEnvFile();

const isProduction = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET || 'bridgenow_secure_jwt_secret_key_2026';

if (isProduction && jwtSecret === 'bridgenow_secure_jwt_secret_key_2026') {
  console.warn('[SECURITY WARNING] Using default JWT_SECRET in production! Please set JWT_SECRET in environment variables.');
}

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  dbPath: process.env.DB_PATH || path.join(__dirname, '..', 'database.db'),
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  cookieMaxAgeDays: parseInt(process.env.COOKIE_MAX_AGE_DAYS || '7', 10)
};
