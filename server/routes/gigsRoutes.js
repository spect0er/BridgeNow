import { Router } from 'express';
import { getUserGigs, createGig, updateGigProgress, deleteGig } from '../controllers/gigsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all gig routes with JWT token authentication
router.use(authenticateToken);

router.get('/', getUserGigs);
router.post('/', createGig);
router.patch('/:id', updateGigProgress);
router.delete('/:id', deleteGig);

export default router;
