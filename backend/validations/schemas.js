const { z } = require('zod');

const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const memberSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email format').optional().or(z.literal('')),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    gender: z.enum(['male', 'female', 'other']).optional(),
    status: z.enum(['active', 'inactive', 'expired']).optional()
});

const attendanceSchema = z.object({
    memberId: z.coerce.number().int().positive('Valid Member ID is required')
});

const paymentSchema = z.object({
    memberId: z.coerce.number().int().positive(),
    amount: z.coerce.number().positive(),
    paymentMethod: z.string(),
    paymentStatus: z.enum(['completed', 'pending', 'failed']).optional()
});

module.exports = {
    loginSchema,
    memberSchema,
    attendanceSchema,
    paymentSchema
};
