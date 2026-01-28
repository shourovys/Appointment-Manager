/**
 * Environment-based configuration interface
 * Defines the structure of all configuration values used throughout the application
 */
export interface IConfig {
  // Application Configuration
  readonly nodeEnv: 'development' | 'test' | 'production';
  readonly port: number;

  // Database Configuration
  readonly mongodbUri: string;
  readonly mongodbDbName: string;
  readonly mongodbUser?: string;
  readonly mongodbPassword?: string;

  // Security Configuration
  readonly jwtSecret: string;

  // Logging Configuration
  readonly logLevel: 'error' | 'warn' | 'info' | 'debug';

  // Observability Configuration
  readonly enableMetrics: boolean;
  readonly enableTracing: boolean;
  readonly otelExporterOtlpEndpoint?: string;
}
