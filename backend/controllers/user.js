import * as complaintService from '../services/complaintService.js';
import { logEvent } from '../services/logService.js';

export const createComplaint = async (req, res, next) => {
    try {
        const { title, description, category } = req.body;
        const fileBuffer = req.file ? req.file.buffer : null;
        
        const complaint = await complaintService.createComplaint(
            req.user.userId, 
            title, 
            description, 
            category, 
            fileBuffer
        );

        await logEvent('COMPLAINT_CREATE', `Complaint ${complaint.id} created`, req.user.userId);
        res.status(201).json(complaint);
    } catch (err) {
        next(err);
    }
};

export const getMyComplaints = async (req, res, next) => {
    try {
        const complaints = await complaintService.getUserComplaints(req.user.userId);
        res.json(complaints);
    } catch (err) {
        next(err);
    }
};

export const getComplaint = async (req, res, next) => {
    try {
        const complaint = await complaintService.getComplaintById(req.params.id, req.user.userId, req.user.role);
        res.json(complaint);
    } catch (err) {
        next(err);
    }
};
