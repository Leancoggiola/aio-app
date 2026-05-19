import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import mediaRoutes from './media/media.routes';
import usersRoutes from './users/users.routes';
import adminRoutes from './admin/admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminRoutes);

export default router;
