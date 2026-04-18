import { query } from '../config/db.js';
import * as emailService from './emailService.js';
import bcrypt from 'bcryptjs';

export const createStaff = async (name, email) => {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) throw { statusCode: 400, message: 'Email already exists' };

    // Generate random 8 char password
    const plainPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const { rows } = await query(
        `INSERT INTO users (name, email, password, role, must_change_pass) 
         VALUES ($1, $2, $3, 'STAFF', true) RETURNING id, name, email`,
        [name, email, hashedPassword]
    );

    // Send email non-blocking
    emailService.sendStaffCredentials(email, name, plainPassword).catch(console.error);

    return rows[0];
};

export const assignComplaint = async (complaintId, staffId) => {
    // Check if complaint exists
    const cCheck = await query('SELECT status FROM complaints WHERE id = $1', [complaintId]);
    if (cCheck.rowCount === 0) throw { statusCode: 404, message: 'Complaint not found' };

    // Check if staff exists and is actually staff
    const sCheck = await query('SELECT role FROM users WHERE id = $1', [staffId]);
    if (sCheck.rowCount === 0 || sCheck.rows[0].role !== 'STAFF') {
        throw { statusCode: 400, message: 'Invalid staff ID' };
    }

    // Insert or update assignment
    await query(
        `INSERT INTO assignments (complaint_id, staff_id) VALUES ($1, $2)
         ON CONFLICT (complaint_id) DO UPDATE SET staff_id = $2, assigned_at = NOW()`,
        [complaintId, staffId]
    );

    // Update status to ASSIGNED if it was PENDING
    if (cCheck.rows[0].status === 'PENDING') {
        await query(`UPDATE complaints SET status = 'ASSIGNED', updated_at = NOW() WHERE id = $1`, [complaintId]);
    }
};

export const getAnalytics = async () => {
    // Total complaints
    const tC = await query('SELECT COUNT(*) FROM complaints');
    
    // By status
    const sC = await query('SELECT status, COUNT(*) FROM complaints GROUP BY status');
    
    // By category
    const cC = await query('SELECT category, COUNT(*) FROM complaints GROUP BY category');

    return {
        total: parseInt(tC.rows[0].count),
        byStatus: sC.rows.map(r => ({ status: r.status, count: parseInt(r.count) })),
        byCategory: cC.rows.map(r => ({ category: r.category, count: parseInt(r.count) }))
    };
};

export const getAllUsers = async () => {
    const { rows } = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    return rows;
};

export const getAllComplaints = async () => {
    const { rows } = await query(
        `SELECT c.*, u.name as user_name, a.staff_id, s.name as staff_name 
         FROM complaints c
         JOIN users u ON c.user_id = u.id
         LEFT JOIN assignments a ON c.id = a.complaint_id
         LEFT JOIN users s ON a.staff_id = s.id
         ORDER BY c.created_at DESC`
    );
    return rows;
};
