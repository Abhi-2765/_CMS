import { z } from 'zod';

// ('HOSTEL','CLASSROOM','INTERNET','SANITATION','ELECTRICAL','PLUMBING','OTHER')
const categories = ['HOSTEL', 'CLASSROOM', 'INTERNET', 'SANITATION', 'ELECTRICAL', 'PLUMBING', 'OTHER'];

export const createComplaintSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.enum(categories, {
      errorMap: () => ({ message: 'Invalid category' })
    })
  })
});

export const updateComplaintStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'])
  }),
  params: z.object({
    id: z.string().uuid()
  })
});

export const addNoteSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Note content cannot be empty')
  }),
  params: z.object({
    id: z.string().uuid()
  })
});
