import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { getDatabase, closeDatabase } from './db/database.js';
import authRoutes from './routes/authRoutes.js';
import gigsRoutes from './routes/gigsRoutes.js';
import transactionsRoutes from './routes/transactionsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Initialize Database connection on boot
getDatabase();

// Standard Express Middlewares
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// System Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    database: 'SQLite (better-sqlite3 / WAL)',
    timestamp: new Date().toISOString()
  });
});

// Mounted Modular Routers
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigsRoutes);
app.use('/api/transactions', transactionsRoutes);

// Global Centralized Error Handling Middleware
app.use(errorHandler);

// Start HTTP Server
const server = app.listen(config.port, () => {
  console.log(`[BridgeNow System] Server listening on http://localhost:${config.port}`);
  console.log(`[BridgeNow System] Environment: ${config.nodeEnv}`);
});

// Process Signal Lifecycle Handlers (Graceful Shutdown)
function handleShutdown(signal) {
  console.log(`\n[BridgeNow System] Received ${signal}. Initiating graceful shutdown...`);
  server.close(() => {
    console.log('[BridgeNow System] HTTP server closed.');
    closeDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default app;
