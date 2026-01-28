import { z } from 'zod';

type ValidatedEnv = z.infer<typeof envSchema>;

/**
 * Environment validation schema using Zod
 * Validates and types all environment variables at application startup
 */

// Base environment schema
const envSchema = z.object({
  // Application Configuration
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().min(1).max(65535))
    .default(3000),

  // Database Configuration
  MONGODB_URI: z
    .string()
    .min(1, 'MONGODB_URI is required')
    .url('MONGODB_URI must be a valid MongoDB connection string')
    .refine(
      (uri) => uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'),
      'MONGODB_URI must start with mongodb:// or mongodb+srv://',
    ),
  MONGODB_DB_NAME: z.string().min(1, 'MONGODB_DB_NAME is required'),
  MONGODB_USER: z.string().optional(),
  MONGODB_PASSWORD: z.string().optional(),

  // Security Configuration
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long for security')
    .max(128, 'JWT_SECRET must not exceed 128 characters'),

  // Logging Configuration
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Observability Configuration
  ENABLE_METRICS: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(z.enum(['true', 'false']).transform((val) => val === 'true'))
    .default(true),
  ENABLE_TRACING: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(z.enum(['true', 'false']).transform((val) => val === 'true'))
    .default(true),
  OTEL_EXPORTER_OTLP_ENDPOINT: z
    .string()
    .url('OTEL_EXPORTER_OTLP_ENDPOINT must be a valid URL if provided')
    .optional()
    .or(z.literal('')),
});

/**
 * Validates environment variables based on the current environment
 * @param env - Environment variables object
 * @returns Validated configuration object
 */
export function validateEnvironment(env: Record<string, string | undefined>): ValidatedEnv {
  try {
    const parsedEnv = envSchema.safeParse(env);

    if (!parsedEnv.success) {
      throw parsedEnv.error;
    }

    return parsedEnv.data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`,
      );
      throw new Error(`Environment validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
}
