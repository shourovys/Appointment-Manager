# Smart Appointment & Queue Manager - Backend API

## 📋 Project Overview

A production-grade NestJS backend application for a comprehensive appointment and queue management system. This project implements enterprise-grade architecture with MongoDB, comprehensive observability, strict code quality gates, and robust security measures.

## 🚀 Key Features

- **Repository Pattern**: Clean abstraction layer between controllers and MongoDB models
- **Observability-First**: Comprehensive logging, metrics, and distributed tracing
- **Strict TypeScript**: Full type safety with no implicit `any` types
- **Test-Driven**: Unit, integration, and E2E tests with coverage gates
- **Security-Hardened**: Validation pipes, Helmet, rate limiting, secure error handling
- **Production-Ready**: Health checks, graceful shutdowns, and monitoring

## 🛠️ Technology Stack & Dependencies

### Core Framework

- **@nestjs/core** (v11.0.1) - Latest stable NestJS framework core
- **@nestjs/common** (v11.0.1) - Common NestJS utilities and decorators
- **@nestjs/platform-express** (v11.0.1) - Express adapter for NestJS

### Database & Configuration

- **@nestjs/mongoose** (latest) - MongoDB ODM integration for NestJS
- **mongoose** (latest) - MongoDB object modeling library
- **@nestjs/config** (latest) - Configuration management module
- **zod** (latest) - TypeScript-first schema validation library

### Testing Framework

- **jest** (v30.0.0) - Latest Jest testing framework with enhanced features
- **@nestjs/testing** (v11.0.1) - NestJS testing utilities
- **mongodb-memory-server** (latest) - In-memory MongoDB for integration tests
- **supertest** (v7.0.0) - HTTP testing utility
- **@types/jest** (v30.0.0) - Jest type definitions
- **@types/supertest** (v6.0.2) - Supertest type definitions

### Observability & Monitoring

- **@opentelemetry/api** (latest) - OpenTelemetry API for distributed tracing
- **@opentelemetry/sdk-node** (latest) - OpenTelemetry SDK for Node.js
- **@opentelemetry/instrumentation-http** (latest) - HTTP request instrumentation
- **@opentelemetry/instrumentation-nestjs-core** (latest) - NestJS core instrumentation
- **winston** (latest) - Professional logging library with structured JSON output
- **@willsoto/nestjs-prometheus** (latest) - Prometheus metrics integration for NestJS

### Security & Validation

- **helmet** (latest) - Security headers middleware
- **@nestjs/throttler** (latest) - Rate limiting module
- **class-validator** (latest) - Decorator-based validation library
- **class-transformer** (latest) - Object transformation library

### Code Quality & Development Tools

- **eslint** (v9.18.0) - Latest ESLint with enhanced TypeScript support
- **@typescript-eslint/eslint-plugin** (v8.20.0) - TypeScript-specific ESLint rules
- **@typescript-eslint/parser** (v8.20.0) - TypeScript parser for ESLint
- **prettier** (v3.4.2) - Code formatter with latest features
- **husky** (latest) - Git hooks management
- **lint-staged** (latest) - Run linters on staged files
- **@commitlint/cli** (latest) - Commit message linting
- **@commitlint/config-conventional** (latest) - Conventional commits configuration

### Build & Development

- **@nestjs/cli** (v11.0.0) - NestJS CLI for project management
- **typescript** (v5.7.3) - Latest TypeScript compiler
- **ts-jest** (v29.2.5) - Jest TypeScript transformer
- **ts-node** (v10.9.2) - TypeScript execution environment
- **tsconfig-paths** (v4.2.0) - TypeScript path mapping resolution

### Utilities

- **reflect-metadata** (v0.2.2) - Metadata reflection API
- **rxjs** (v7.8.1) - Reactive programming library

## 📝 TypeScript Configuration

### Strict Type Checking

This project enforces **strict TypeScript configuration** to catch potential errors at compile time:

#### Core Strict Settings

- **`strict: true`** - Enables all strict type-checking options
- **`strictNullChecks: true`** - Prevents null/undefined assignment errors
- **`strictFunctionTypes: true`** - Enforces strict function type checking
- **`strictBindCallApply: true`** - Validates bind/call/apply method usage
- **`strictPropertyInitialization: true`** - Ensures class properties are initialized

#### Type Safety Enforcement

- **`noImplicitAny: true`** - Disallows implicit `any` types (requires explicit typing)
- **`noImplicitThis: true`** - Prevents implicit `this` in class methods
- **`alwaysStrict: true`** - Always emits "use strict" directive
- **`noImplicitReturns: true`** - Ensures all code paths return a value
- **`noFallthroughCasesInSwitch: true`** - Prevents switch statement fallthrough bugs

#### Code Quality

- **`noUnusedLocals: true`** - Flags unused local variables
- **`noUnusedParameters: true`** - Flags unused function parameters
- **`forceConsistentCasingInFileNames: true`** - Enforces consistent file naming

### Path Aliases

The project uses path aliases for clean imports:

```typescript
// Instead of relative imports like: ../../../common/filters
// Use absolute imports like:
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
```

**Configured Aliases:**

- `@/*` → `src/*`
- `@/common/*` → `src/common/*`
- `@/config/*` → `src/config/*`
- `@/database/*` → `src/database/*`
- `@/users/*` → `src/users/*`
- `@/health/*` → `src/health/*`

### Build Configuration

- **`tsconfig.json`** - Development configuration with full type checking
- **`tsconfig.build.json`** - Production build configuration (extends tsconfig.json)
  - Excludes test files from production builds
  - Optimized for deployment

### Benefits

1. **Runtime Error Prevention**: Catches potential bugs at compile time
2. **Better IDE Support**: Enhanced IntelliSense and refactoring capabilities
3. **Code Quality**: Enforces consistent coding patterns
4. **Team Consistency**: Standardized coding practices across the team
5. **Maintainability**: Makes code easier to understand and maintain

## 📋 Version Justification

### Latest Stable Versions

All packages are pinned to their latest stable versions to ensure:

- **Security**: Latest security patches and vulnerability fixes
- **Performance**: Performance improvements and optimizations
- **Compatibility**: Compatibility with other dependencies
- **Features**: Access to newest features and improvements

### TypeScript 5.7.3

- **Strict Type Checking**: Enhanced strict mode options
- **Improved Type Inference**: Better type inference capabilities
- **Performance**: Faster compilation times
- **ES2024 Support**: Latest ECMAScript features

### Jest 30.0.0

- **Enhanced Test Runner**: Improved test execution performance
- **Better TypeScript Support**: Native TypeScript integration
- **Modern Async Testing**: Improved async/await testing patterns
- **Snapshot Improvements**: Enhanced snapshot testing capabilities

### ESLint 9.18.0 + TypeScript ESLint 8.20.0

- **Flat Config**: Latest ESLint flat configuration format
- **Enhanced TypeScript Rules**: Comprehensive TypeScript-specific linting
- **Performance**: Improved linting performance for large codebases
- **Better Integration**: Seamless TypeScript and ESLint integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB 6+ (for production)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd wallet-api

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run start:dev
```

### Environment Configuration

Create a `.env.development` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/smart-appointment

# Security
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure

# Logging
LOG_LEVEL=info

# Observability
ENABLE_METRICS=true
ENABLE_TRACING=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

### MongoDB Setup

1. **Install MongoDB** locally or use MongoDB Atlas cloud service
2. **Create database**: `smart_appointment_db`
3. **Update MONGODB_URI** in your `.env.development` file
4. **Start MongoDB service** if running locally

### Demo User Credentials

The application includes a demo user that is automatically seeded on startup:

- **Email**: `demo@example.com`
- **Password**: `demo123`
- **Role**: `admin`

Use these credentials to log in and test all features.

## 🏃‍♂️ Available Scripts

### Development

```bash
npm run start:dev     # Start with watch mode
npm run start:debug   # Start with debug mode
npm run start:prod    # Start production server
```

### Code Quality

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
```

### Testing

```bash
npm run test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:cov      # Run tests with coverage
npm run test:e2e      # Run end-to-end tests
npm run test:debug    # Debug tests
```

### Build & Deployment

```bash
npm run build         # Build for production
npm run typecheck     # TypeScript type checking
npm run clean         # Clean build directory
```

## 📁 Project Structure

```
src/
├── common/              # Shared utilities and components
│   ├── filters/         # Exception filters
│   ├── guards/          # Authentication/authorization guards
│   ├── interceptors/    # Request/response interceptors
│   ├── logging/         # Logging configuration
│   ├── metrics/         # Prometheus metrics
│   └── tracing/         # Distributed tracing
├── config/              # Configuration management
│   ├── configuration.ts # Configuration factory
│   ├── validation.schema.ts # Environment validation
│   └── types/           # Configuration types
├── database/            # Database layer
│   ├── repositories/    # Repository pattern implementations
│   ├── schemas/         # Mongoose schemas
│   ├── database.module.ts
│   └── database.service.ts
├── health/              # Health check endpoints
├── users/               # User management module
│   ├── controllers/     # HTTP controllers
│   ├── services/        # Business logic
│   ├── repositories/    # Data access layer
│   ├── schemas/         # User schemas
│   └── dto/             # Data transfer objects
└── main.ts              # Application entry point
```

## 🧪 Testing Strategy

### Unit Tests

- **Location**: `src/**/*.spec.ts`
- **Coverage Target**: 80% minimum
- **Framework**: Jest with ts-jest
- **Mocking**: Jest mocks for external dependencies

### Integration Tests

- **Location**: `test/integration/**/*.test.ts`
- **Database**: In-memory MongoDB (mongodb-memory-server)
- **Isolation**: Each test runs in isolation with clean database state

### End-to-End Tests

- **Location**: `test/e2e/**/*.e2e-spec.ts`
- **Scope**: Full application testing
- **Database**: Separate test database
- **Coverage**: Critical user flows and API endpoints

## 🔒 Security Features

### Input Validation

- **Global Validation Pipe**: Automatic request validation
- **DTO Validation**: Class-validator decorators
- **Type Safety**: Strict TypeScript configuration

### Security Headers

- **Helmet Integration**: Comprehensive security headers
- **CORS Configuration**: Controlled cross-origin access
- **Rate Limiting**: Request throttling protection

### Error Handling

- **Secure Error Responses**: No sensitive data exposure
- **Correlation IDs**: Request tracking for debugging
- **Structured Logging**: Security-aware logging

## 📊 Observability

### Logging

- **Structured JSON Logs**: Winston with correlation IDs
- **Log Levels**: Environment-based log level configuration
- **Sensitive Data Protection**: Automatic PII sanitization

### Metrics

- **Prometheus Integration**: `/metrics` endpoint
- **Business Metrics**: Custom application metrics
- **System Metrics**: CPU, memory, and database metrics

### Tracing

- **OpenTelemetry**: Distributed tracing with Jaeger/Tempo
- **Automatic Instrumentation**: HTTP and database tracing
- **Custom Spans**: Application-specific tracing

## 🏥 Health Checks

### Endpoints

- `GET /health/live` - Liveness probe (always returns 200)
- `GET /health/ready` - Readiness probe (checks dependencies)
- `GET /health` - Detailed health status

### Health Indicators

- **Database**: MongoDB connection health
- **Memory**: Memory usage monitoring
- **Disk**: Disk space availability

## 📝 API Documentation

### Swagger/OpenAPI

- **Endpoint**: `http://localhost:3001/api/docs`
- **Auto-generation**: From DTOs and controllers
- **Authentication**: JWT token support in Swagger UI
- **Features**: Interactive API testing, request/response examples

## 🚀 Deployment

### Docker Support

```bash
# Build Docker image
docker build -t wallet-api .

# Run with docker-compose
docker-compose up -d
```

### Environment-Specific Builds

```bash
# Development
npm run build

# Production
NODE_ENV=production npm run build
npm run start:prod
```

### Kubernetes

```yaml
# health check configuration
livenessProbe:
  httpGet:
    path: /health/live
    port: 3001
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3001
  initialDelaySeconds: 5
  periodSeconds: 5
```

## 🤝 Contributing

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new user authentication
fix: resolve database connection timeout
docs: update API documentation
test: add integration tests for user service
```

### Code Quality Gates

- **ESLint**: All rules must pass
- **Prettier**: Code formatting must be consistent
- **TypeScript**: No type errors allowed
- **Tests**: All tests must pass with 80%+ coverage
- **Pre-commit Hooks**: Automatic quality checks before commits

### Development Workflow

1. Create feature branch from `main`
2. Implement changes with tests
3. Run quality checks: `npm run quality:all`
4. Submit pull request
5. Code review and approval required
6. Merge to `main` after CI passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the [documentation](docs/)
- Review [troubleshooting guide](docs/TROUBLESHOOTING.md)

---

**Built with ❤️ using NestJS and modern Node.js practices**
#   A p p o i n t m e n t - M a n a g e r  
 