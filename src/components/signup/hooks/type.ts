import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
export const SUPPORTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export const SignupSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  profileImage: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, { message: 'Profile image is required' })
    .transform((files) => files[0])
    .refine((file) => SUPPORTED_FILE_TYPES.includes(file.type), {
      message: 'Unsupported file type',
    })
    .refine((file) => file.size < MAX_FILE_SIZE, { message: 'File size exceeds limit' }),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignupFormInput = z.infer<typeof SignupSchema>;
