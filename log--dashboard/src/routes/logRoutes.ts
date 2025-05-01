import { Router } from 'express';
import { createLog } from '../controllers/logController';

const router = Router();

router.post('/logs', createLog);

export default router;

