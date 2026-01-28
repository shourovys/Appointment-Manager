import { IConfig } from './types/config.interface.js';
import { validateEnvironment } from './validation.schema.js';

/**
 * Configuration factory for NestJS ConfigModule
 * Validates environment variables and returns typed configuration
 */
export default (): IConfig => {
  // Get all environment variables
  const env = process.env;

  // Validate and parse environment variables
  const validatedConfig = validateEnvironment(env);

  return {
    nodeEnv: validatedConfig.NODE_ENV,
    port: validatedConfig.PORT,
    mongodbUri: validatedConfig.MONGODB_URI,
    mongodbDbName: validatedConfig.MONGODB_DB_NAME,
    mongodbUser: validatedConfig.MONGODB_USER,
    mongodbPassword: validatedConfig.MONGODB_PASSWORD,
    jwtSecret: validatedConfig.JWT_SECRET,
    logLevel: validatedConfig.LOG_LEVEL,
    enableMetrics: validatedConfig.ENABLE_METRICS,
    enableTracing: validatedConfig.ENABLE_TRACING,
    otelExporterOtlpEndpoint: validatedConfig.OTEL_EXPORTER_OTLP_ENDPOINT,
  };
};
