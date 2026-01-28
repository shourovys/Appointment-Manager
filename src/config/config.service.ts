import { IConfig } from './types/config.interface.js';

/**
 * Configuration service for type-safe config access
 * Provides helper methods for accessing configuration values
 */
export class ConfigService {
  constructor(private readonly config: IConfig) {}

  // Getters for all config values
  get nodeEnv(): 'development' | 'test' | 'production' {
    return this.config.nodeEnv;
  }

  get port(): number {
    return this.config.port;
  }

  get mongodbUri(): string {
    return this.config.mongodbUri;
  }

  get mongodbDbName(): string {
    return this.config.mongodbDbName;
  }

  get mongodbUser(): string | undefined {
    return this.config.mongodbUser;
  }

  get mongodbPassword(): string | undefined {
    return this.config.mongodbPassword;
  }

  get jwtSecret(): string {
    return this.config.jwtSecret;
  }

  get logLevel(): 'error' | 'warn' | 'info' | 'debug' {
    return this.config.logLevel;
  }

  get enableMetrics(): boolean {
    return this.config.enableMetrics;
  }

  get enableTracing(): boolean {
    return this.config.enableTracing;
  }

  get otelExporterOtlpEndpoint(): string | undefined {
    return this.config.otelExporterOtlpEndpoint;
  }

  // Helper methods
  getDatabaseUrl(): string {
    if (this.mongodbUser && this.mongodbPassword) {
      return `mongodb://${this.mongodbUser}:${this.mongodbPassword}@${this.mongodbUri}/${this.mongodbDbName}`;
    }
    return `mongodb://${this.mongodbUri}/${this.mongodbDbName}`;
  }

  isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  isMetricsEnabled(): boolean {
    return this.enableMetrics;
  }

  isTracingEnabled(): boolean {
    return this.enableTracing;
  }

  requiresAuth(): boolean {
    return this.isProduction();
  }

  getRequiredEnvVars(): string[] {
    const required = ['NODE_ENV', 'PORT', 'MONGODB_URI', 'MONGODB_DB_NAME', 'JWT_SECRET'];

    if (this.isProduction()) {
      required.push('MONGODB_USER', 'MONGODB_PASSWORD');
    }

    return required;
  }
}
