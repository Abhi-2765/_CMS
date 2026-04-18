import { getRollingMetrics } from '../middleware/metrics.js';
import { query } from '../config/db.js';

export const getMetricsSummary = async () => {
    const rolling = getRollingMetrics();
    
    // Aggregate historical metrics
    const statsResult = await query(`
        SELECT 
            COUNT(*) as total_requests,
            AVG(latency_ms) as avg_latency,
            sum(case when status_code >= 400 then 1 else 0 end) * 100.0 / nullif(count(*), 0) as error_rate_percent,
            sum(case when status_code < 400 then 1 else 0 end) as success_count
        FROM metrics
    `);

    // P95 latency approximation
    const p95Result = await query(`
        SELECT percentile_cont(0.95) within group (order by latency_ms) as p95_latency
        FROM metrics
    `);

    const stats = statsResult.rows[0];
    const p95 = p95Result.rows[0].p95_latency;

    return {
        requestsPerMinute: rolling.requestsPerMinute,
        rollingErrorRate: rolling.errorRate,
        totalRequests: parseInt(stats.total_requests || '0'),
        avgLatencyMs: Math.round(parseFloat(stats.avg_latency || '0')),
        p95LatencyMs: Math.round(parseFloat(p95 || '0')),
        historicalErrorRate: parseFloat(stats.error_rate_percent || '0').toFixed(2) + '%'
    };
};
