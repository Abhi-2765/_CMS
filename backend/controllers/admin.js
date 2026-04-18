import * as adminService from '../services/adminService.js';
import { logEvent, getLogs } from '../services/logService.js';

export const createStaff = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const staff = await adminService.createStaff(name, email);
        await logEvent('STAFF_CREATE', `Created staff account: ${email}`, req.user.userId);
        res.status(201).json({ message: 'Staff created successfully', staff });
    } catch (err) {
        next(err);
    }
};

export const assignComplaint = async (req, res, next) => {
    try {
        const { complaintId, staffId } = req.body;
        await adminService.assignComplaint(complaintId, staffId);
        await logEvent('COMPLAINT_ASSIGN', `Assigned complaint ${complaintId} to staff ${staffId}`, req.user.userId);
        res.json({ message: 'Complaint assigned successfully' });
    } catch (err) {
        next(err);
    }
};

export const getAnalytics = async (req, res, next) => {
    try {
        const stats = await adminService.getAnalytics();
        res.json(stats);
    } catch (err) {
        next(err);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const getAllComplaints = async (req, res, next) => {
    try {
        const complaints = await adminService.getAllComplaints();
        res.json(complaints);
    } catch (err) {
        next(err);
    }
};

export const fetchLogs = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const logs = await getLogs(limit);
        res.json(logs);
    } catch (err) {
        next(err);
    }
};
