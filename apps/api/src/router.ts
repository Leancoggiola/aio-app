import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import mediaRoutes from './media/media.routes';
import usersRoutes from './users/users.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/users', usersRoutes);

export default router;
