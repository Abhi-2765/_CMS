import cloudinary from '../config/cloudinary.js';
import { query } from '../config/db.js';

export const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'cms_complaints' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
};

export const createComplaint = async (userId, title, description, category, fileBuffer) => {
    let imageUrl = null;
    if (fileBuffer) {
        imageUrl = await uploadImage(fileBuffer);
    }

    const { rows } = await query(
        `INSERT INTO complaints (user_id, title, description, category, image_url) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, title, description, category, imageUrl]
    );
    return rows[0];
};

export const getUserComplaints = async (userId) => {
    const { rows } = await query(
        `SELECT c.*, a.staff_id, u.name as staff_name 
         FROM complaints c
         LEFT JOIN assignments a ON c.id = a.complaint_id
         LEFT JOIN users u ON a.staff_id = u.id
         WHERE c.user_id = $1 ORDER BY c.created_at DESC`,
        [userId]
    );
    return rows;
};

export const getComplaintById = async (complaintId, userId, role) => {
    // Check access first
    const { rows } = await query(
        `SELECT c.*, u.name as user_name, u.email as user_email
         FROM complaints c
         JOIN users u ON c.user_id = u.id
         WHERE c.id = $1`,
        [complaintId]
    );
    
    if (rows.length === 0) throw { statusCode: 404, message: 'Complaint not found' };
    const complaint = rows[0];

    // Access control
    if (role === 'USER' && complaint.user_id !== userId) {
        throw { statusCode: 403, message: 'Forbidden' };
    }
    
    if (role === 'STAFF') {
        const assign = await query('SELECT staff_id FROM assignments WHERE complaint_id = $1', [complaintId]);
        if (assign.rowCount === 0 || assign.rows[0].staff_id !== userId) {
            throw { statusCode: 403, message: 'Forbidden: Note assigned to you' };
        }
    }

    // Get progress notes
    const notesRes = await query('SELECT * FROM progress_notes WHERE complaint_id = $1 ORDER BY created_at ASC', [complaintId]);
    return { ...complaint, notes: notesRes.rows };
};
