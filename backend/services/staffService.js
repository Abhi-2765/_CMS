import { query } from '../config/db.js';

export const getAssignedComplaints = async (staffId) => {
    const { rows } = await query(
        `SELECT c.*, u.name as user_name
         FROM complaints c
         JOIN assignments a ON c.id = a.complaint_id
         JOIN users u ON c.user_id = u.id
         WHERE a.staff_id = $1
         ORDER BY c.updated_at DESC`,
        [staffId]
    );
    return rows;
};

export const updateStatus = async (complaintId, staffId, status) => {
    // Verify assignment
    const assign = await query('SELECT * FROM assignments WHERE complaint_id = $1 AND staff_id = $2', [complaintId, staffId]);
    if (assign.rowCount === 0) throw { statusCode: 403, message: 'Cannot modify unassigned complaint' };

    await query('UPDATE complaints SET status = $1, updated_at = NOW() WHERE id = $2', [status, complaintId]);
};

export const addProgressNote = async (complaintId, staffId, content) => {
    // Verify assignment
    const assign = await query('SELECT * FROM assignments WHERE complaint_id = $1 AND staff_id = $2', [complaintId, staffId]);
    if (assign.rowCount === 0) throw { statusCode: 403, message: 'Cannot add note to unassigned complaint' };

    await query('INSERT INTO progress_notes (complaint_id, content) VALUES ($1, $2)', [complaintId, content]);
};
