import { z } from 'zod';
import { jwtConfigSchema, mongoConfigSchema } from '../utils/config/config-schema';

export type MongoConfigType = z.infer<typeof mongoConfigSchema>;
export type JwtConfigType = z.infer<typeof jwtConfigSchema>;
