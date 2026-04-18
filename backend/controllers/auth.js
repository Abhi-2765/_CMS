import * as authService from '../services/authService.js';
import { logEvent } from '../services/logService.js';

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await authService.registerUser(name, email, password);
        await logEvent('USER_REGISTER', `User registered: ${email}`, user.id);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginUser(email, password);
        
        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        await logEvent('USER_LOGIN', `User logged in: ${email}`, user.id);
        res.json({ user, token });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        if (req.user) {
            await logEvent('USER_LOGOUT', 'User logged out', req.user.userId);
        }
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        await authService.changePassword(req.user.userId, oldPassword, newPassword);
        await logEvent('PASSWORD_CHANGE', 'User changed password', req.user.userId);
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        next(err);
    }
};

export const getMe = async (req, res, next) => {
    // If auth middleware passed, req.user holds token payload
    res.json({ user: req.user });
};
