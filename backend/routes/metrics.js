import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { getMetricsSummary } from '../services/metricsService.js';

const router = Router();

router.get('/summary', authenticate, authorize('ADMIN'), async (req, res, next) => {
    try {
        const summary = await getMetricsSummary();
        res.json(summary);
    } catch (error) {
        next(error);
    }
});

export default router;
