import { query } from '../config/db.js';

let errorCount = 0;
let requestCount = 0;

// Reset counters every minute for rolling metrics
setInterval(() => {
    errorCount = 0;
    requestCount = 0;
}, 60000);

export const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    requestCount++;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusCode = res.statusCode;
        
        if (statusCode >= 400) {
            errorCount++;
        }

        // Fire and forget db log
        query(
            `INSERT INTO metrics (method, path, status_code, latency_ms) VALUES ($1, $2, $3, $4)`,
            [req.method, req.path, statusCode, duration]
        ).catch(err => console.error('Failed to log metrics:', err));
    });

    next();
};

export const getRollingMetrics = () => {
    return {
        requestsPerMinute: requestCount,
        errorRate: requestCount === 0 ? 0 : (errorCount / requestCount) * 100
    };
};
