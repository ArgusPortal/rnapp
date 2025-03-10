import {
	getAllUsers,
	getUserById,
	updateMe,
	getMe,
	deleteMe,
	getStats,
} from '../controllers/Users.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getAllUsers);
router.get('/stats', getStats);
router.get('/me', getMe);
router.get('/:id', getUserById);
router.put('/me', updateMe);
router.delete('/me', deleteMe);

export default router;
