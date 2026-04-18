import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message || err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.errors
        });
    }

    if (err.statusCode) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    res.status(500).json({
        error: 'Internal server error'
    });
};
