# Sprint Backlog: NestJS + MongoDB + Observability Backend Setup

## 📋 Executive Summary

### Project Context

This is a **fresh project setup** (not a refactor) for building a production-grade NestJS backend with:

- MongoDB + Mongoose as the primary database
- First-class observability (logging, metrics, tracing, health checks)
- Strict code quality gates
- Enterprise-grade security
- Comprehensive testing infrastructure
- Repository pattern for data access

### Gap Analysis

Since this is a greenfield project, **no existing codebase exists**. All components must be built from scratch following industry best practices and the requirements specified.

### Key Architectural Decisions

1. **Repository Pattern**: Mandatory abstraction layer between controllers and MongoDB models
2. **Observability-First**: Logging, metrics, and tracing are not optional - they're core features
3. **Strict TypeScript**: No `any` types, full type safety enforced
4. **Test-Driven**: Unit, integration, and E2E tests with coverage gates
5. **Security-Hardened**: Validation pipes, helmet, rate limiting, secure error handling

---

## 🎯 Story Breakdown

### Epic 1: Project Foundation & Configuration

Stories: 3 | Estimated Points: 5

---

#### Story 1.1: Initialize NestJS Project with Core Dependencies

**Priority**: P0 (Blocker) | **Points**: 2

**Description**: Set up the base NestJS project structure with all required dependencies for MongoDB, testing, code quality, and observability.

**Tasks**:

- [x] Install NestJS CLI globally (`npm i -g @nestjs/cli`)
- [x] Create new NestJS project (`nest new <project-name> --package-manager npm`)
- [x] Install MongoDB dependencies:
  - [x] `@nestjs/mongoose`
  - [x] `mongoose`
- [x] Install configuration dependencies:
  - [x] `@nestjs/config`
  - [x] `zod` for environment validation
- [x] Install testing dependencies:
  - [x] `mongodb-memory-server` for integration tests
  - [x] `supertest` for E2E tests
  - [x] `@types/jest`, `@types/supertest`
- [x] Install observability dependencies:
  - [x] `@opentelemetry/api`
  - [x] `@opentelemetry/sdk-node`
  - [x] `@opentelemetry/instrumentation-http`
  - [x] `@opentelemetry/instrumentation-nestjs-core`
  - [x] `winston` or `pino` for structured logging
  - [x] `@willsoto/nestjs-prometheus` for metrics
- [x] Install security dependencies:
  - [x] `helmet`
  - [x] `@nestjs/throttler` for rate limiting
  - [x] `class-validator`
  - [x] `class-transformer`
- [x] Install code quality dependencies:
  - [x] `eslint`
  - [x] `prettier`
  - [x] `husky`
  - [x] `lint-staged`
  - [x] `@commitlint/cli`
  - [x] `@commitlint/config-conventional`
- [x] Verify all dependencies resolve correctly
- [x] Document all dependencies in README with version justifications

**Acceptance Criteria**:

- All dependencies install without conflicts
- `package.json` contains all required packages with latest stable versions
- No deprecated packages used

---

#### Story 1.2: Configure TypeScript for Strict Mode

**Priority**: P0 (Blocker) | **Points**: 1

**Description**: Set up TypeScript configuration with strict type checking enabled to prevent runtime errors and enforce code quality.

**Tasks**:

- [x] Update `tsconfig.json` with strict settings:
  - [x] Enable `"strict": true`
  - [x] Enable `"strictNullChecks": true`
  - [x] Enable `"strictFunctionTypes": true`
  - [x] Enable `"strictBindCallApply": true`
  - [x] Enable `"strictPropertyInitialization": true`
  - [x] Enable `"noImplicitAny": true`
  - [x] Enable `"noImplicitThis": true`
  - [x] Enable `"alwaysStrict": true`
  - [x] Enable `"noUnusedLocals": true`
  - [x] Enable `"noUnusedParameters": true`
  - [x] Enable `"noImplicitReturns": true`
  - [x] Enable `"noFallthroughCasesInSwitch": true`
  - [x] Set `"esModuleInterop": true`
  - [x] Set `"skipLibCheck": true`
  - [x] Configure path aliases for clean imports
- [x] Create `tsconfig.build.json` for production builds
- [x] Verify compilation passes with no errors
- [x] Document TypeScript configuration choices

**Acceptance Criteria**:

- TypeScript compiles with all strict checks enabled
- No `any` types are allowed without explicit `eslint-disable`
- Path aliases work correctly

---

#### Story 1.3: Set Up Environment Configuration with Validation

**Priority**: P0 (Blocker) | **Points**: 2

**Description**: Implement environment-based configuration with schema validation to prevent runtime errors from missing or invalid environment variables.

**Tasks**:

- [x] Create `src/config/` directory
- [x] Create `src/config/configuration.ts` for configuration factory
- [x] Create `src/config/validation.schema.ts` for Zod schema
- [x] Define environment schema with:
  - [x] `NODE_ENV` (required, enum: development, test, production)
  - [x] `PORT` (required, number, default: 3000)
  - [x] `MONGODB_URI` (required, string, format validation)
  - [x] `MONGODB_DB_NAME` (required, string)
  - [x] `MONGODB_USER` (optional for dev, required for prod)
  - [x] `MONGODB_PASSWORD` (optional for dev, required for prod)
  - [x] `JWT_SECRET` (required, minimum length)
  - [x] `LOG_LEVEL` (enum: error, warn, info, debug)
  - [x] `ENABLE_METRICS` (boolean, default: true)
  - [x] `ENABLE_TRACING` (boolean, default: true)
  - [x] `OTEL_EXPORTER_OTLP_ENDPOINT` (optional)
- [x] Create `.env.example` with all variables documented
- [x] Create `.env.development` for local development
- [x] Create `.env.test` for test environment
- [x] Add `.env*` to `.gitignore` (except `.env.example`)
- [x] Configure `ConfigModule` in `app.module.ts`:
  - [x] Use `isGlobal: true`
  - [x] Enable validation with schema
  - [x] Load appropriate `.env` file based on NODE_ENV
- [x] Create `src/config/types/config.interface.ts` for typed config access
- [x] Add helper functions for type-safe config retrieval

**Acceptance Criteria**:

- Application fails to start if required env variables are missing
- Environment schema validation catches invalid values before runtime
- Configuration is accessible via dependency injection
- All environments (dev, test, prod) have separate configurations

---

### Epic 2: Code Quality & Governance

Stories: 4 | Estimated Points: 8

---

#### Story 2.1: Configure ESLint with Strict Rules

**Priority**: P0 (Blocker) | **Points**: 2

**Description**: Set up ESLint with NestJS and TypeScript best practices to enforce code quality standards.

**Tasks**:

- [x] Create `.eslintrc.js` with strict rules
- [x] Extend recommended configurations:
  - [x] `@typescript-eslint/recommended`
  - [x] `@typescript-eslint/recommended-requiring-type-checking`
  - [x] `plugin:@typescript-eslint/strict`
  - [x] `prettier` (to disable conflicting rules)
- [x] Configure custom rules:
  - [x] Ban `any` types (`@typescript-eslint/no-explicit-any: error`)
  - [x] Enforce consistent return types (`@typescript-eslint/explicit-function-return-type`)
  - [x] Detect circular dependencies (`import/no-cycle`)
  - [x] Require dependency injection patterns
  - [x] Enforce naming conventions for classes, interfaces, enums
  - [x] Disallow console.log in production code
- [x] Add ESLint ignore patterns in `.eslintignore`:
  - [x] `node_modules/`
  - [x] `dist/`
  - [x] `coverage/`
- [ ] Create NPM scripts:
  - [ ] `"lint": "eslint \"{src,apps,libs,test}/**/*.ts\"`
  - [ ] `"lint:fix": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"`
- [x] Integrate with VS Code settings (`.vscode/settings.json`)
- [x] Test linting on entire codebase

**Acceptance Criteria**:

- ESLint runs without errors on default NestJS files
- All critical rules are enforced
- Linting catches `any` types and circular dependencies
- Auto-fix works for style issues

---

#### Story 2.2: Configure Prettier for Consistent Formatting

**Priority**: P0 (Blocker) | **Points**: 1

**Description**: Set up Prettier to ensure consistent code formatting across the team.

**Tasks**:

- [x] Create `.prettierrc` with configuration:
  - [x] `"singleQuote": true`
  - [x] `"trailingComma": "all"`
  - [x] `"printWidth": 100`
  - [x] `"tabWidth": 2`
  - [x] `"semi": true`
  - [x] `"arrowParens": "always"`
- [x] Create `.prettierignore`:
  - [x] `node_modules/`
  - [x] `dist/`
  - [x] `coverage/`
  - [x] `*.md`
- [x] Create NPM scripts:
  - [x] `"format": "prettier --write \"{src,apps,libs,test}/**/*.ts\""`
  - [x] `"format:check": "prettier --check \"{src,apps,libs,test}/**/*.ts\""`
- [x] Integrate with VS Code settings for format-on-save
- [x] Run format check on codebase

**Acceptance Criteria**:

- Prettier formats code consistently
- No conflicts between ESLint and Prettier
- Format-on-save works in IDE

---

#### Story 2.3: Set Up Git Hooks with Husky & Lint-Staged on root level (wallet folder (D:\code\projects\wallet))

**Priority**: P0 (Blocker) | **Points**: 3

**Description**: Configure Git hooks to enforce code quality and conventional commits before allowing commits.

**Tasks**:

- [x] Initialize Husky: `npx husky-init && npm install`
- [x] Configure lint-staged in `package.json`:
  ```json
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
  ```
- [x] Create `.husky/pre-commit` hook:
  - [x] Run `npx lint-staged`
  - [x] Run unit tests on staged files (optional but recommended)
- [x] Install commitlint: `npm install --save-dev @commitlint/{cli,config-conventional}`
- [x] Create `commitlint.config.js`:
  - [x] Enforce conventional commits (feat, fix, chore, docs, etc.)
  - [x] Set max subject length
- [x] Create `.husky/commit-msg` hook:
  - [x] Run `npx commitlint --edit $1`
- [ ] Test pre-commit hook by making a test commit
- [ ] Test commit-msg hook with invalid commit message
- [x] Document commit message conventions in CONTRIBUTING.md

**Acceptance Criteria**:

- Pre-commit hook runs linting and formatting automatically
- Commits fail if code doesn't pass quality checks
- Commit messages must follow conventional format
- Hooks work for all team members

---

#### Story 2.4: Configure EditorConfig for Cross-IDE Consistency

**Priority**: P1 (High) | **Points**: 2

**Description**: Create `.editorconfig` to ensure consistent coding styles across different IDEs and editors.

**Tasks**:

- [ ] Create `.editorconfig` in project root:

  ```
  root = true

  [*]
  charset = utf-8
  indent_style = space
  indent_size = 2
  end_of_line = lf
  insert_final_newline = true
  trim_trailing_whitespace = true

  [*.md]
  trim_trailing_whitespace = false
  ```

- [ ] Test with multiple editors (VS Code, WebStorm)
- [ ] Document EditorConfig in README

**Acceptance Criteria**:

- EditorConfig settings apply across different IDEs
- Consistent indentation and line endings enforced

---

### Epic 3: MongoDB & Database Layer

Stories: 5 | Estimated Points: 13

---

#### Story 3.1: Configure MongoDB Connection Module

**Priority**: P0 (Blocker) | **Points**: 3

**Description**: Set up MongoDB connection with proper configuration, error handling, and environment-based settings.

**Tasks**:

- [ ] Create `src/database/` directory
- [ ] Create `src/database/database.module.ts`
- [ ] Configure `MongooseModule.forRootAsync()` in database module:
  - [ ] Inject `ConfigService` for environment variables
  - [ ] Set up connection URI from config
  - [ ] Configure connection options:
    - [ ] `autoIndex: false` (for production)
    - [ ] Connection pooling (`maxPoolSize`, `minPoolSize`)
    - [ ] Timeout settings
    - [ ] Retry logic (`retryAttempts`, `retryDelay`)
  - [ ] Add connection event listeners (connected, error, disconnected)
- [ ] Create `src/database/database.service.ts` for health checks
- [ ] Implement connection health indicator
- [ ] Add MongoDB query logging middleware (sanitized, no sensitive data)
- [ ] Create connection error handler with retry logic
- [ ] Import database module in `app.module.ts`
- [ ] Test connection with local MongoDB
- [ ] Test connection failure handling
- [ ] Document MongoDB configuration in README

**Acceptance Criteria**:

- MongoDB connection succeeds with valid credentials
- Connection fails gracefully with clear error messages
- Connection pooling is configured properly
- Query logging works without exposing sensitive data

---

#### Story 3.2: Create Base Schema with Common Fields

**Priority**: P0 (Blocker) | **Points**: 2

**Description**: Create a base Mongoose schema that all entities will extend, providing common fields like timestamps, soft delete, and versioning.

**Tasks**:

- [ ] Create `src/database/schemas/base.schema.ts`
- [ ] Define base schema with common fields:
  - [ ] `_id` (ObjectId, auto-generated)
  - [ ] `createdAt` (Date, auto-generated)
  - [ ] `updatedAt` (Date, auto-generated)
  - [ ] `deletedAt` (Date, nullable, for soft delete)
  - [ ] `isDeleted` (Boolean, default: false)
  - [ ] `version` (Number, for optimistic locking)
- [ ] Create TypeScript interface `IBaseSchema`:
  - [ ] Include all base fields
  - [ ] Make deletedAt optional
- [ ] Add schema options:
  - [ ] `timestamps: true`
  - [ ] `versionKey: '__v'`
  - [ ] `toJSON` transformation (hide `__v`, transform `_id` to `id`)
  - [ ] `toObject` transformation
- [ ] Create utility methods:
  - [ ] `softDelete()` instance method
  - [ ] `restore()` instance method
  - [ ] Query helper `findNotDeleted()`
- [ ] Document base schema usage with examples

**Acceptance Criteria**:

- Base schema provides all common fields
- Soft delete functionality works correctly
- Timestamps are automatically managed
- Schema transformations work as expected

---

#### Story 3.3: Implement Repository Pattern Base Class

**Priority**: P0 (Blocker) | **Points**: 3

**Description**: Create an abstract repository base class that all data access layers will extend, enforcing consistent database operations.

**Tasks**:

- [ ] Create `src/database/repositories/` directory
- [ ] Create `src/database/repositories/base.repository.ts`
- [ ] Define `IBaseRepository<T>` interface with methods:
  - [ ] `create(data: Partial<T>): Promise<T>`
  - [ ] `findById(id: string): Promise<T | null>`
  - [ ] `findOne(filter: FilterQuery<T>): Promise<T | null>`
  - [ ] `findAll(filter?: FilterQuery<T>): Promise<T[]>`
  - [ ] `update(id: string, data: Partial<T>): Promise<T | null>`
  - [ ] `delete(id: string): Promise<boolean>` (soft delete)
  - [ ] `hardDelete(id: string): Promise<boolean>`
  - [ ] `count(filter?: FilterQuery<T>): Promise<number>`
  - [ ] `exists(filter: FilterQuery<T>): Promise<boolean>`
- [ ] Create abstract `BaseRepository<T>` class implementing interface:
  - [ ] Inject Mongoose Model via constructor
  - [ ] Implement all CRUD methods with error handling
  - [ ] Add soft delete filter to read operations
  - [ ] Use lean queries where appropriate for performance
  - [ ] Add transaction support methods
- [ ] Create pagination utilities:
  - [ ] `PaginationDto` with `page`, `limit`, `sort` fields
  - [ ] `PaginatedResult<T>` interface
  - [ ] `paginate(filter, paginationDto)` method
- [ ] Create query builder utilities for filtering and sorting
- [ ] Add MongoDB error handlers (duplicate key, validation, etc.)
- [ ] Write unit tests for base repository
- [ ] Document repository pattern usage

**Acceptance Criteria**:

- Base repository provides all common operations
- Soft delete is enforced by default
- Pagination works correctly
- Transaction support is available
- All MongoDB errors are properly handled

---

#### Story 3.4: Create Example User Module with Repository

**Priority**: P1 (High) | **Points**: 3

**Description**: Implement a complete example module (User) demonstrating the repository pattern, DTOs, and schema usage.

**Tasks**:

- [ ] Generate User module: `nest g module users`
- [ ] Generate User controller: `nest g controller users`
- [ ] Generate User service: `nest g service users`
- [ ] Create `src/users/schemas/user.schema.ts`:
  - [ ] Extend base schema
  - [ ] Define user fields: `email`, `username`, `firstName`, `lastName`, `role`, `isActive`
  - [ ] Add indexes: unique email, username
  - [ ] Add validation decorators
  - [ ] Export User model type
- [ ] Create `src/users/repositories/user.repository.ts`:
  - [ ] Extend `BaseRepository<User>`
  - [ ] Add custom methods: `findByEmail`, `findByUsername`
  - [ ] Implement search functionality
- [ ] Create DTOs in `src/users/dto/`:
  - [ ] `create-user.dto.ts` with class-validator decorators
  - [ ] `update-user.dto.ts` extending PartialType
  - [ ] `user-response.dto.ts` for response serialization
  - [ ] `user-query.dto.ts` for filtering and pagination
- [ ] Implement UserService:
  - [ ] Inject UserRepository
  - [ ] Implement business logic methods
  - [ ] Add error handling with custom exceptions
  - [ ] No direct Model usage - only through repository
- [ ] Implement UserController:
  - [ ] RESTful endpoints (GET, POST, PUT, DELETE)
  - [ ] Use ValidationPipe for DTO validation
  - [ ] Use interceptors for response transformation
  - [ ] Add Swagger decorators
- [ ] Register User schema in users.module.ts
- [ ] Write unit tests for UserService
- [ ] Write integration tests for UserRepository
- [ ] Write E2E tests for UserController

**Acceptance Criteria**:

- User module follows repository pattern strictly
- No direct Model access in controller or service
- All DTOs have proper validation
- CRUD operations work end-to-end
- Tests pass with good coverage

---

#### Story 3.5: Add MongoDB Transaction Support

**Priority**: P1 (High) | **Points**: 2

**Description**: Implement transaction support for operations that require atomicity across multiple collections.

**Tasks**:

- [ ] Create `src/database/transaction.service.ts`
- [ ] Implement transaction wrapper:
  - [ ] `withTransaction<T>(callback: (session) => Promise<T>): Promise<T>`
  - [ ] Start session, begin transaction
  - [ ] Execute callback with session
  - [ ] Commit on success, abort on error
  - [ ] Handle transaction timeouts
- [ ] Update base repository to accept optional session parameter:
  - [ ] Add `session?: ClientSession` to all methods
  - [ ] Pass session to Mongoose operations
- [ ] Create example transaction use case in UserService
- [ ] Add transaction retry logic for transient errors
- [ ] Write integration tests for transactions
- [ ] Document transaction usage patterns

**Acceptance Criteria**:

- Transactions work across multiple collections
- Rollback works on errors
- Retry logic handles transient failures
- Transaction service is reusable

---

### Epic 4: Security & Validation

Stories: 4 | Estimated Points: 8

---

#### Story 4.1: Configure Global Validation Pipe

**Priority**: P0 (Blocker) | **Points**: 2

**Description**: Set up global validation to automatically validate all incoming requests using class-validator.

**Tasks**:

- [ ] Configure ValidationPipe in `main.ts`:
  - [ ] Use `whitelist: true` to strip unknown properties
  - [ ] Use `forbidNonWhitelisted: true` to throw on unknown properties
  - [ ] Use `transform: true` to auto-transform payloads to DTO instances
  - [ ] Use `transformOptions: { enableImplicitConversion: true }`
  - [ ] Set custom exception factory for validation errors
- [ ] Create custom validation exception filter:
  - [ ] Format validation errors consistently
  - [ ] Return clear error messages
- [ ] Test validation with missing required fields
- [ ] Test validation with invalid data types
- [ ] Test validation with extra fields
- [ ] Document validation behavior

**Acceptance Criteria**:

- All requests are automatically validated
- Invalid requests return 400 with clear error messages
- Unknown fields are stripped or rejected based on config
- Type transformation works automatically

---

#### Story 4.2: Implement HTTP Security Headers (Helmet)

**Priority**: P0 (Blocker) | **Points**: 1

**Description**: Configure Helmet middleware to set secure HTTP headers protecting against common vulnerabilities.

**Tasks**:

- [ ] Install helmet: `npm install helmet`
- [ ] Configure helmet in `main.ts`:
  - [ ] Enable all default protections
  - [ ] Configure CSP (Content Security Policy)
  - [ ] Configure HSTS (HTTP Strict Transport Security)
  - [ ] Configure frame options
- [ ] Test security headers in response
- [ ] Document security headers configuration

**Acceptance Criteria**:

- All security headers are set correctly
- Application passes basic security audits
- Headers are appropriate for production use

---

#### Story 4.3: Configure Rate Limiting

**Priority**: P1 (High) | **Points**: 2

**Description**: Implement rate limiting to protect against brute force and DDoS attacks.

**Tasks**:

- [ ] Install throttler: `npm install @nestjs/throttler`
- [ ] Create `src/common/guards/throttler.guard.ts`
- [ ] Configure ThrottlerModule in app.module.ts:
  - [ ] Set TTL (time to live) and limit per TTL
  - [ ] Configure different limits for different routes
  - [ ] Add IP-based tracking
- [ ] Apply global throttler guard
- [ ] Configure custom rate limit response messages
- [ ] Create bypass logic for internal services
- [ ] Test rate limiting with multiple requests
- [ ] Document rate limiting configuration

**Acceptance Criteria**:

- Rate limiting works per IP address
- Exceeded limits return 429 Too Many Requests
- Different routes can have different limits
- Rate limit headers are included in response

---

#### Story 4.4: Set Up CORS and Centralized Exception Handling

**Priority**: P1 (High) | **Points**: 3

**Description**: Configure CORS for secure cross-origin requests and implement global exception handling for consistent error responses.

**Tasks**:

- [ ] Configure CORS in `main.ts`:
  - [ ] Set allowed origins from environment
  - [ ] Configure allowed methods
  - [ ] Set credentials support
  - [ ] Add preflight handling
- [ ] Create `src/common/filters/` directory
- [ ] Create `src/common/filters/http-exception.filter.ts`:
  - [ ] Catch all HTTP exceptions
  - [ ] Format error responses consistently
  - [ ] Include correlation ID in errors
  - [ ] Hide stack traces in production
  - [ ] Log errors with proper context
- [ ] Create custom business exception classes:
  - [ ] `NotFoundException`
  - [ ] `BadRequestException`
  - [ ] `UnauthorizedException`
  - [ ] `ForbiddenException`
  - [ ] `ConflictException`
- [ ] Create MongoDB exception filter for database errors:
  - [ ] Handle duplicate key errors
  - [ ] Handle validation errors
  - [ ] Handle connection errors
- [ ] Apply filters globally in main.ts
- [ ] Test exception handling for various error scenarios
- [ ] Document error response format

**Acceptance Criteria**:

- CORS works for allowed origins
- All exceptions return consistent JSON format
- Stack traces are hidden in production
- MongoDB errors are properly transformed
- Error responses include correlation IDs

---

### Epic 5: Observability - Logging

Stories: 3 | Estimated Points: 8

---

#### Story 5.1: Implement Structured Logging with Winston/Pino

**Priority**: P0 (Blocker) | **Points**: 3

**Description**: Set up structured JSON logging with correlation IDs for distributed tracing.

**Tasks**:

- [ ] Choose logging library (Winston or Pino)
- [ ] Create `src/common/logging/` directory
- [ ] Create `src/common/logging/logger.service.ts`:
  - [ ] Implement custom logger service
  - [ ] Use structured JSON format
  - [ ] Add log levels (error, warn, info, debug)
  - [ ] Include timestamp, correlation ID, context in all logs
  - [ ] Configure log transports (console, file, external)
- [ ] Create `src/common/logging/logger.module.ts`
- [ ] Configure different log levels per environment:
  - [ ] Development: debug
  - [ ] Test: warn
  - [ ] Production: info
- [ ] Create correlation ID middleware:
  - [ ] Generate unique ID for each request
  - [ ] Store in async context (AsyncLocalStorage)
  - [ ] Include in all logs
- [ ] Create request/response logging interceptor:
  - [ ] Log HTTP method, URL, status code
  - [ ] Log request duration
  - [ ] Sanitize sensitive data (passwords, tokens)
- [ ] Add MongoDB query logging (optional, sanitized)
- [ ] Configure log rotation for file transports
- [ ] Test logging in different environments
- [ ] Document logging configuration

**Acceptance Criteria**:

- All logs are in structured JSON format
- Correlation IDs link related log entries
- Sensitive data is never logged
- Logs include proper context and metadata
- Log levels work correctly per environment

---

#### Story 5.2: Create Log Aggregation Support

**Priority**: P1 (High) | **Points**: 3

**Description**: Configure logging outputs compatible with popular log aggregation systems (Loki, Datadog, ELK).

**Tasks**:

- [ ] Create transport configurations for:
  - [ ] Loki (via winston-loki or pino-loki)
  - [ ] Datadog (via dd-trace)
  - [ ] Elasticsearch (via winston-elasticsearch)
- [ ] Add environment configuration for log export:
  - [ ] `LOG_EXPORT_ENABLED`
  - [ ] `LOG_EXPORT_URL`
  - [ ] `LOG_EXPORT_API_KEY`
- [ ] Create conditional transport initialization based on config
- [ ] Add error handling for transport failures
- [ ] Test log export to external system
- [ ] Create example Loki/Grafana setup with docker-compose
- [ ] Document log aggregation setup

**Acceptance Criteria**:

- Logs can be exported to external systems
- Export failures don't crash application
- Log format is compatible with aggregators
- Example setup works locally

---

#### Story 5.3: Add Context-Aware Logging Throughout Application

**Priority**: P2 (Medium) | **Points**: 2

**Description**: Add meaningful logging throughout the application at appropriate points.

**Tasks**:

- [ ] Add logging to:
  - [ ] Application startup/shutdown
  - [ ] Database connections
  - [ ] HTTP requests/responses
  - [ ] Repository operations
  - [ ] Service layer business logic
  - [ ] Error scenarios
  - [ ] Performance-critical operations
- [ ] Use appropriate log levels for each scenario
- [ ] Include contextual information (user ID, request ID, etc.)
- [ ] Ensure no PII (Personally Identifiable Information) is logged
- [ ] Review and sanitize all log statements
- [ ] Create logging guidelines document

**Acceptance Criteria**:

- Application has comprehensive logging coverage
- Logs provide useful troubleshooting information
- No sensitive data is exposed in logs
- Logs are at appropriate levels

---

### Epic 6: Observability - Metrics

Stories: 3 | Estimated Points: 7

---

#### Story 6.1: Set Up Prometheus Metrics Endpoint

**Priority**: P0 (Blocker) | **Points**: 2

**Description**: Configure Prometheus-compatible metrics endpoint for monitoring application health and performance.

**Tasks**:

- [ ] Install Prometheus client: `@willsoto/nestjs-prometheus`
- [ ] Create `src/common/metrics/` directory
- [ ] Create `src/common/metrics/metrics.module.ts`
- [ ] Configure PrometheusModule in app.module.ts:
  - [ ] Set metrics path: `/metrics`
  - [ ] Enable default metrics (CPU, memory, etc.)
- [ ] Create `/metrics` endpoint (auto-generated by module)
- [ ] Test metrics endpoint returns Prometheus format
- [ ] Document metrics endpoint

**Acceptance Criteria**:

- `/metrics` endpoint is accessible
- Returns Prometheus-compatible format
- Default system metrics are included

---

#### Story 6.2: Implement Custom Business Metrics

**Priority**: P1 (High) | **Points**: 3

**Description**: Add custom metrics for HTTP requests, MongoDB operations, and business-specific events.

**Tasks**:

- [ ] Create `src/common/metrics/metrics.service.ts`
- [ ] Implement HTTP request metrics:
  - [ ] Counter: `http_requests_total` (labels: method, route, status)
  - [ ] Histogram: `http_request_duration_seconds`
  - [ ] Counter: `http_errors_total` (labels: method, route, status)
- [ ] Implement MongoDB metrics:
  - [ ] Histogram: `mongodb_query_duration_seconds` (label: operation)
  - [ ] Counter: `mongodb_errors_total` (label: error_type)
  - [ ] Gauge: `mongodb_connection_pool_size`
- [ ] Create interceptor for automatic HTTP metrics:
  - [ ] Track request count
  - [ ] Track request duration
  - [ ] Track errors
- [ ] Create MongoDB metrics middleware:
  - [ ] Track query execution time
  - [ ] Track query errors
- [ ] Add business metrics examples:
  - [ ] Counter: `users_created_total`
  - [ ] Gauge: `active_users_count`
- [ ] Apply metrics interceptor globally
- [ ] Test metrics collection
- [ ] Document custom metrics

**Acceptance Criteria**:

- HTTP metrics are collected automatically
- MongoDB metrics track query performance
- Custom business metrics work correctly
- Metrics are properly labeled

---

#### Story 6.3: Create Grafana Dashboard Configuration

**Priority**: P2 (Medium) | **Points**: 2

**Description**: Create example Grafana dashboard JSON configuration for visualizing metrics.

**Tasks**:

- [ ] Create `monitoring/grafana/` directory
- [ ] Create dashboard JSON with panels for:
  - [ ] HTTP request rate
  - [ ] HTTP error rate
  - [ ] HTTP latency percentiles (p50, p95, p99)
  - [ ] MongoDB query latency
  - [ ] MongoDB error rate
  - [ ] System metrics (CPU, memory)
  - [ ] Active connections
- [ ] Create Prometheus scrape configuration
- [ ] Create docker-compose setup with:
  - [ ] Prometheus
  - [ ] Grafana
  - [ ] NestJS app
- [ ] Test dashboard with sample data
- [ ] Document dashboard setup and usage

**Acceptance Criteria**:

- Dashboard visualizes all key metrics
- Docker-compose setup works locally
- Documentation explains dashboard panels

---

### Epic 7: Observability - Distributed Tracing

Stories: 3 | Estimated Points: 9

---

#### Story 7.1: Set Up OpenTelemetry SDK

**Priority**: P1 (High) | **Points**: 3

**Description**: Configure OpenTelemetry for distributed tracing with auto-instrumentation.

**Tasks**:

- [ ] Install OpenTelemetry packages:
  - [ ] `@opentelemetry/api`
  - [ ] `@opentelemetry/sdk-node`
  - [ ] `@opentelemetry/auto-instrumentations-node`
  - [ ] `@opentelemetry/exporter-jaeger` or `@opentelemetry/exporter-otlp-http`
- [ ] Create `src/common/tracing/` directory
- [ ] Create `src/common/tracing/tracing.ts` for SDK initialization
- [ ] Configure NodeSDK with:
  - [ ] Service name from environment
  - [ ] Auto-instrumentation for HTTP, MongoDB
  - [ ] OTLP exporter configuration
  - [ ] Sampling strategy
- [ ] Initialize tracing in `main.ts` before app creation
- [ ] Add trace context propagation middleware
- [ ] Test trace generation
- [ ] Document tracing configuration

**Acceptance Criteria**:

- OpenTelemetry SDK initializes successfully
- Traces are generated for HTTP requests
- Trace IDs are propagated through request chain

---

#### Story 7.2: Add Custom Spans for Services and Repositories

**Priority**: P1 (High) | **Points**: 3

**Description**: Instrument application code with custom spans for better visibility into service and repository operations.

**Tasks**:

- [ ] Create `src/common/tracing/decorators/trace.decorator.ts`:
  - [ ] Create `@Trace()` decorator for methods
  - [ ] Automatically create span for decorated methods
  - [ ] Include method name, class name, arguments in span
- [ ] Create `src/common/tracing/tracing.service.ts`:
  - [ ] Wrapper for OpenTelemetry API
  - [ ] Methods: `startSpan()`, `endSpan()`, `addEvent()`, `setAttributes()`
- [ ] Add tracing to:
  - [ ] Controller methods (via interceptor)
  - [ ] Service methods (via @Trace decorator)
  - [ ] Repository methods (via base repository)
  - [ ] MongoDB operations (auto-instrumented)
- [ ] Add span attributes:
  - [ ] User ID
  - [ ] Request ID
  - [ ] Resource IDs
  - [ ] Operation result
- [ ] Add span events for significant operations
- [ ] Test trace hierarchy (parent-child relationships)
- [ ] Document tracing decorator usage

**Acceptance Criteria**:

- Custom spans are created for all operations
- Span hierarchy shows request flow
- Spans include relevant attributes
- Traces are exportable to backend

---

#### Story 7.3: Configure Jaeger/Tempo Integration

**Priority**: P2 (Medium) | **Points**: 3

**Description**: Set up trace exporter to send traces to Jaeger or Grafana Tempo for visualization.

**Tasks**:

- [ ] Choose trace backend (Jaeger or Tempo)
- [ ] Configure OTLP exporter:
  - [ ] Set endpoint URL from environment
  - [ ] Configure headers/authentication
  - [ ] Set batch settings
  - [ ] Configure retry logic
- [ ] Create docker-compose with trace backend
- [ ] Add environment variables:
  - [ ] `OTEL_EXPORTER_OTLP_ENDPOINT`
  - [ ] `OTEL_SERVICE_NAME`
  - [ ] `OTEL_TRACES_SAMPLER`
- [ ] Test trace export to backend
- [ ] Create example queries in Jaeger/Tempo
- [ ] Document trace backend setup

**Acceptance Criteria**:

- Traces are successfully exported
- Traces are visible in Jaeger/Tempo UI
- Trace queries work correctly
- Docker-compose setup works locally

---

### Epic 8: Observability - Health Checks

Stories: 2 | Estimated Points: 5

---

#### Story 8.1: Implement Health Check Endpoints

**Priority**: P0 (Blocker) | **Points**: 3

**Description**: Create health check endpoints for Kubernetes readiness and liveness probes.

**Tasks**:

- [ ] Install health check package: `@nestjs/terminus`
- [ ] Create `src/health/` directory
- [ ] Create `src/health/health.module.ts`
- [ ] Create `src/health/health.controller.ts`
- [ ] Implement `/health/live` endpoint (liveness probe):
  - [ ] Always returns 200 if app is running
  - [ ] Minimal checks (process alive)
- [ ] Implement `/health/ready` endpoint (readiness probe):
  - [ ] Check MongoDB connection
  - [ ] Check critical dependencies
  - [ ] Return 503 if not ready
- [ ] Create custom health indicators:
  - [ ] MongoDB health indicator
  - [ ] Disk space health indicator
  - [ ] Memory health indicator
- [ ] Add health check timeout configuration
- [ ] Test health endpoints
- [ ] Document health check usage for K8s

**Acceptance Criteria**:

- Liveness probe endpoint always responds
- Readiness probe fails when MongoDB is down
- Health checks return proper status codes
- Response format follows Terminus standard

---

#### Story 8.2: Add Dependency Health Indicators

**Priority**: P1 (High) | **Points**: 2

**Description**: Create health indicators for all external dependencies.

**Tasks**:

- [ ] Create MongoDB health indicator:
  - [ ] Ping database
  - [ ] Check connection status
  - [ ] Include connection pool stats
- [ ] Create health check for:
  - [ ] Redis (if used)
  - [ ] External APIs (if any)
  - [ ] S3/Storage (if used)
- [ ] Add detailed health response with:
  - [ ] Status of each dependency
  - [ ] Response time for checks
  - [ ] Additional metadata
- [ ] Configure health check intervals
- [ ] Test health checks with dependency failures
- [ ] Document adding custom health indicators

**Acceptance Criteria**:

- All dependencies have health indicators
- Health checks detect dependency failures
- Response includes detailed status information

---

### Epic 9: Testing Infrastructure

Stories: 4 | Estimated Points: 13

---

#### Story 9.1: Configure Jest for Unit Testing

**Priority**: P0 (Blocker) | **Points**: 3

**Description**: Set up Jest with proper configuration, coverage thresholds, and module path mapping.

**Tasks**:

- [ ] Create `jest.config.ts` with configuration:
  - [ ] TypeScript support via ts-jest
  - [ ] Module path mapping (same as tsconfig)
  - [ ] Coverage thresholds: 80% for all metrics
  - [ ] Coverage collection from src/\*_/_.ts
  - [ ] Exclude test files from coverage
  - [ ] Setup files for test utilities
- [ ] Configure coverage thresholds:
  - [ ] `branches: 80`
  - [ ] `functions: 80`
  - [ ] `lines: 80`
  - [ ] `statements: 80`
- [ ] Create test utilities in `test/utils/`:
  - [ ] Mock factory functions
  - [ ] Test data builders
  - [ ] Common test assertions
- [ ] Create NPM scripts:
  - [ ] `"test": "jest"`
  - [ ] `"test:watch": "jest --watch"`
  - [ ] `"test:cov": "jest --coverage"`
  - [ ] `"test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"`
- [ ] Configure VS Code debugging for tests
- [ ] Run tests to verify setup
- [ ] Document testing approach

**Acceptance Criteria**:

- Jest runs successfully
- Coverage thresholds are enforced
- Module paths resolve correctly
- Test debugging works in IDE

---

#### Story 9.2: Set Up In-Memory MongoDB for Integration Tests

**Priority**: P0 (Blocker) | **Points**: 3

**Description**: Configure mongodb-memory-server for isolated integration tests.

**Tasks**:

- [ ] Install `mongodb-memory-server`
- [ ] Create `test/setup/` directory
- [ ] Create `test/setup/mongodb-memory-server.ts`:
  - [ ] Start MongoDB server before all tests
  - [ ] Stop server after all tests
  - [ ] Clear database between tests
  - [ ] Export connection URI
- [ ] Create `test/setup/test-database.module.ts`:
  - [ ] Test database module factory
  - [ ] Use in-memory MongoDB
  - [ ] Auto-cleanup between tests
- [ ] Create integration test example in users module:
  - [ ] Test repository operations
  - [ ] Test with real MongoDB (in-memory)
  - [ ] Verify CRUD operations
- [ ] Configure Jest to use global setup/teardown
- [ ] Add integration test script: `"test:integration"`
- [ ] Document integration testing patterns

**Acceptance Criteria**:

- In-memory MongoDB starts/stops automatically
- Integration tests run in isolation
- Database is cleaned between tests
- Tests run without external dependencies

---

#### Story 9.3: Implement E2E Testing Setup

**Priority**: P1 (High) | **Points**: 4

**Description**: Set up end-to-end testing with supertest and dedicated test environment.

**Tasks**:

- [ ] Create `test/e2e/` directory
- [ ] Create Jest config for E2E: `jest-e2e.config.ts`
- [ ] Create E2E test database setup:
  - [ ] Use separate test database
  - [ ] Seed test data
  - [ ] Clear data between tests
- [ ] Create E2E test utilities:
  - [ ] App factory function
  - [ ] Authentication helper
  - [ ] Request helper functions
  - [ ] Test data factories
- [ ] Write example E2E tests for users module:
  - [ ] Test full request/response cycle
  - [ ] Test authentication flow
  - [ ] Test validation errors
  - [ ] Test error handling
- [ ] Create NPM script: `"test:e2e"`
- [ ] Configure E2E tests to run with coverage
- [ ] Test E2E suite execution
- [ ] Document E2E testing patterns

**Acceptance Criteria**:

- E2E tests run against full application
- Tests use dedicated test database
- Tests cover happy path and error scenarios
- E2E coverage is tracked separately

---

#### Story 9.4: Write Comprehensive Tests for Core Modules

**Priority**: P1 (High) | **Points**: 3

**Description**: Implement unit, integration, and E2E tests for all core functionality.

**Tasks**:

- [ ] Write unit tests for:
  - [ ] Configuration module
  - [ ] Logger service
  - [ ] Metrics service
  - [ ] Tracing service
  - [ ] Base repository
  - [ ] Exception filters
  - [ ] Validation pipes
  - [ ] Guards
  - [ ] Interceptors
- [ ] Write integration tests for:
  - [ ] Database connection
  - [ ] Repository operations
  - [ ] Transaction handling
  - [ ] MongoDB error scenarios
- [ ] Write E2E tests for:
  - [ ] Health check endpoints
  - [ ] Metrics endpoint
  - [ ] User CRUD operations
  - [ ] Error responses
  - [ ] Rate limiting
- [ ] Achieve 80%+ coverage for all modules
- [ ] Add tests to CI pipeline
- [ ] Document test coverage expectations

**Acceptance Criteria**:

- All core modules have test coverage above 80%
- Tests cover both happy paths and error cases
- Tests are maintainable and well-organized
- CI pipeline enforces coverage thresholds

---

### Epic 10: Developer Experience

Stories: 3 | Estimated Points: 6

---

#### Story 10.1: Create Development Scripts and Tooling

**Priority**: P1 (High) | **Points**: 2

**Description**: Set up NPM scripts and development tools for efficient workflow.

**Tasks**:

- [ ] Create comprehensive NPM scripts:
  - [ ] `"dev"`: Start with watch mode and env loading
  - [ ] `"build"`: Production build
  - [ ] `"start:prod"`: Start production server
  - [ ] `"start:debug"`: Start with debugging
  - [ ] `"clean"`: Clean dist folder
  - [ ] `"typecheck"`: TypeScript type checking
  - [ ] `"test:all"`: Run all test suites
  - [ ] `"migrate"`: Database migration (if applicable)
  - [ ] `"seed"`: Seed database with test data
- [ ] Create development utilities:
  - [ ] Database seeder script
  - [ ] Data migration utilities
  - [ ] Mock data generators
- [ ] Configure debugging in VS Code (`.vscode/launch.json`)
- [ ] Create development docker-compose:
  - [ ] MongoDB
  - [ ] MongoDB Express
  - [ ] Redis (optional)
- [ ] Test all scripts
- [ ] Document development workflow

**Acceptance Criteria**:

- All NPM scripts work correctly
- Development environment starts easily
- Debugging works in VS Code
- Docker-compose provides local dependencies

---

#### Story 10.2: Set Up CI/CD Pipeline (GitHub Actions)

**Priority**: P1 (High) | **Points**: 2

**Description**: Create GitHub Actions workflows for automated testing, linting, and building.

**Tasks**:

- [ ] Create `.github/workflows/` directory
- [ ] Create `ci.yml` workflow:
  - [ ] Trigger on push and PR
  - [ ] Run linting
  - [ ] Run type checking
  - [ ] Run unit tests
  - [ ] Run integration tests
  - [ ] Run E2E tests
  - [ ] Generate coverage reports
  - [ ] Upload coverage to Codecov
  - [ ] Build production bundle
- [ ] Create `cd.yml` workflow:
  - [ ] Trigger on tag push
  - [ ] Build Docker image
  - [ ] Push to container registry
  - [ ] Deploy to staging (optional)
- [ ] Add status badges to README
- [ ] Configure branch protection rules
- [ ] Test workflows
- [ ] Document CI/CD setup

**Acceptance Criteria**:

- CI runs on all PRs and commits
- All quality checks must pass before merge
- Docker images are built automatically
- Deployment pipeline works (if applicable)

---

#### Story 10.3: Create Multi-Stage Production Dockerfile

**Priority**: P1 (High) | **Points**: 2

**Description**: Build optimized Docker image with multi-stage build for production deployment.

**Tasks**:

- [ ] Create `Dockerfile` with multi-stage build:
  - [ ] Stage 1: Dependencies (install all deps)
  - [ ] Stage 2: Build (compile TypeScript)
  - [ ] Stage 3: Production (only prod deps and dist)
- [ ] Configure Dockerfile:
  - [ ] Use Alpine Node.js image for smaller size
  - [ ] Run as non-root user
  - [ ] Copy only necessary files
  - [ ] Set proper environment variables
  - [ ] Expose port 3000
  - [ ] Use HEALTHCHECK instruction
- [ ] Create `.dockerignore`:
  - [ ] Exclude node_modules, dist, tests
  - [ ] Exclude .env files
  - [ ] Exclude .git
- [ ] Create `docker-compose.prod.yml` for production-like environment
- [ ] Build and test Docker image locally
- [ ] Optimize image size (target <200MB)
- [ ] Document Docker usage

**Acceptance Criteria**:

- Docker image builds successfully
- Image runs in production mode
- Image is optimized (small size)
- Health checks work in container
- Docker-compose setup works

---

### Epic 11: Documentation

Stories: 3 | Estimated Points: 8

---

#### Story 11.1: Create Comprehensive README

**Priority**: P0 (Blocker) | **Points**: 3

**Description**: Write detailed README covering setup, development, testing, and deployment.

**Tasks**:

- [ ] Create sections in README.md:
  - [ ] Project overview and features
  - [ ] Technology stack
  - [ ] Prerequisites
  - [ ] Installation instructions
  - [ ] Environment configuration
  - [ ] Development workflow
  - [ ] Testing guide
  - [ ] Build and deployment
  - [ ] Project structure
  - [ ] Observability setup
  - [ ] Contributing guidelines
  - [ ] License
- [ ] Add code examples for common tasks
- [ ] Include troubleshooting section
- [ ] Add links to additional documentation
- [ ] Include architecture diagrams (if applicable)
- [ ] Add status badges (build, coverage, etc.)
- [ ] Review and proofread

**Acceptance Criteria**:

- README is comprehensive and clear
- New developers can set up project following README
- All major features are documented
- README is well-structured and navigable

---

#### Story 11.2: Add Swagger/OpenAPI Documentation

**Priority**: P1 (High) | **Points**: 3

**Description**: Configure Swagger for automatic API documentation generation.

**Tasks**:

- [ ] Install Swagger: `@nestjs/swagger`
- [ ] Configure Swagger in `main.ts`:
  - [ ] Set API title, description, version
  - [ ] Configure authentication schemes
  - [ ] Set up Swagger UI route: `/api/docs`
- [ ] Add Swagger decorators to:
  - [ ] Controllers (@ApiTags, @ApiOperation)
  - [ ] DTOs (@ApiProperty)
  - [ ] Response types (@ApiResponse)
  - [ ] Query parameters (@ApiQuery)
- [ ] Configure DTO documentation:
  - [ ] Add descriptions to all fields
  - [ ] Add examples
  - [ ] Mark required/optional fields
- [ ] Group endpoints by tags
- [ ] Add authentication to Swagger UI
- [ ] Generate OpenAPI JSON/YAML export
- [ ] Test Swagger UI
- [ ] Document API versioning (if applicable)

**Acceptance Criteria**:

- Swagger UI is accessible at `/api/docs`
- All endpoints are documented
- Request/response schemas are accurate
- Examples are provided for complex DTOs
- OpenAPI spec can be exported

---

#### Story 11.3: Create Architecture and Observability Documentation

**Priority**: P2 (Medium) | **Points**: 2

**Description**: Document system architecture, design decisions, and observability setup.

**Tasks**:

- [ ] Create `docs/` directory
- [ ] ## Create `docs/ARCHITECTURE.md`:
