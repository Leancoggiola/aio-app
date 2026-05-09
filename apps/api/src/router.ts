import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import mediaRoutes from './media/media.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);

export default router;
