import * as staffService from '../services/staffService.js';
import { logEvent } from '../services/logService.js';

export const getAssignedComplaints = async (req, res, next) => {
    try {
        const complaints = await staffService.getAssignedComplaints(req.user.userId);
        res.json(complaints);
    } catch (err) {
        next(err);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        await staffService.updateStatus(id, req.user.userId, status);
        await logEvent('STATUS_UPDATE', `Updated status of ${id} to ${status}`, req.user.userId);
        res.json({ message: 'Status updated successfully' });
    } catch (err) {
        next(err);
    }
};

export const addNote = async (req, res, next) => {
    try {
        const { content } = req.body;
        const { id } = req.params;
        await staffService.addProgressNote(id, req.user.userId, content);
        await logEvent('NOTE_ADD', `Added note to complaint ${id}`, req.user.userId);
        res.status(201).json({ message: 'Note added successfully' });
    } catch (err) {
        next(err);
    }
};
