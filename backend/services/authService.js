import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const registerUser = async (name, email, password) => {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
        throw { statusCode: 400, message: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
        `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'USER') RETURNING id, name, email, role`,
        [name, email, hashedPassword]
    );

    return result.rows[0];
};

export const loginUser = async (email, password) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
        throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role, mustChangePass: user.must_change_pass },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, mustChangePass: user.must_change_pass },
        token
    };
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    const result = await query('SELECT password FROM users WHERE id = $1', [userId]);
    if (result.rowCount === 0) throw { statusCode: 404, message: 'User not found' };

    const isMatch = await bcrypt.compare(oldPassword, result.rows[0].password);
    if (!isMatch) throw { statusCode: 401, message: 'Incorrect old password' };

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await query(
        'UPDATE users SET password = $1, must_change_pass = false, updated_at = NOW() WHERE id = $2',
        [hashedNew, userId]
    );
};
