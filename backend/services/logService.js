import { query } from '../config/db.js';

export const logEvent = async (eventType, description, userId = null) => {
    try {
        await query(
            'INSERT INTO logs (event_type, description, user_id) VALUES ($1, $2, $3)',
            [eventType, description, userId]
        );
    } catch (error) {
        console.error('Failed to write log:', error);
    }
};

export const getLogs = async (limit = 100) => {
    const result = await query(
        `SELECT l.id, l.event_type, l.description, l.created_at, u.name as user_name 
         FROM logs l
         LEFT JOIN users u ON l.user_id = u.id
         ORDER BY l.created_at DESC LIMIT $1`,
        [limit]
    );
    return result.rows;
};
