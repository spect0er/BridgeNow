import { Router } from 'express';
import { getUserWallet, depositFunds, withdrawFunds } from '../controllers/transactionsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all wallet transaction routes with JWT token authentication
router.use(authenticateToken);

router.get('/', getUserWallet);
router.post('/deposit', depositFunds);
router.post('/withdraw', withdrawFunds);

export default router;
