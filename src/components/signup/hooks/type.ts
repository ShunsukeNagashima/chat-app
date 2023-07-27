import { z } from 'zod';

export const SignupSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignupFormInput = z.infer<typeof SignupSchema>;
