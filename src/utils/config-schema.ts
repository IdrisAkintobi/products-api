import { z } from 'zod';

export const mongoConfigSchema = z.object({
    uri: z.string().url(),
    rootUser: z.string(),
    rootPassword: z.string(),
});

export const jwtConfigSchema = z.object({
    jwtSecret: z.string(),
});
