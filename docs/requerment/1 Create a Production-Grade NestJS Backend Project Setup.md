Act as a Principal Backend Architect, Platform Engineer, and Observability-Focused Software Lead.

Your task is to design and generate a comprehensive, industry-ready backend project setup using NestJS and TypeScript, following modern best practices, strict quality gates, and enterprise-grade observability standards.

🎯 OBJECTIVE

Create a production-grade NestJS backend foundation that:

Enforces strict code quality

Uses latest stable packages

Is secure, testable, scalable, and maintainable

Provides developer confidence through automation

Provides deep observability into system behavior

Uses MongoDB with Mongoose as the primary database

Is suitable for long-term enterprise development

This is a fresh project setup, not a refactor.

🧱 TECH STACK REQUIREMENTS
Core

NestJS (latest stable)

TypeScript (strict mode enabled)

Node.js LTS

Database

MongoDB

Mongoose

@nestjs/mongoose

🧼 CODE QUALITY & GOVERNANCE

ESLint (strict rules, NestJS + TypeScript best practices)

Prettier (consistent formatting)

Husky + lint-staged (pre-commit enforcement)

Commitlint (Conventional Commits)

No any types

No circular dependencies

Linting & tests must block commits

⚙️ CONFIGURATION & ENVIRONMENT

@nestjs/config

Environment schema validation (zod or joi)

Environment separation:

development

test

production

Secure secrets handling (no hardcoded values)

🧪 TESTING (MANDATORY)
Unit Testing

Jest (latest)

Per-module test structure

Enforced coverage thresholds

Integration Testing

In-memory MongoDB (e.g., mongodb-memory-server)

Repository/service isolation

Database connection lifecycle management

E2E Testing

@nestjs/testing

Supertest

Dedicated test MongoDB environment

🔐 SECURITY & STABILITY

Global validation pipe

DTO-based request validation

Centralized exception handling

HTTP security headers (helmet)

Rate limiting

CORS configuration

Secure error responses (no stack leaks in prod)

🧠 ARCHITECTURE & STRUCTURE

Design a clean, scalable folder structure with:

Modular architecture

Clear separation of:

Controllers

Services

DTOs

Schemas (Mongoose)

Repositories (Data Access Layer)

Guards

Interceptors

Pipes

Shared/Common module

Config module

Health check module

📦 DATABASE DESIGN (MONGOOSE BEST PRACTICES)

Schema-based modeling using @Schema() decorators

Explicit collection naming

Index definitions

Lean queries where applicable

Soft delete support

Timestamps (createdAt, updatedAt)

Repository pattern (no direct Model access in controllers)

Transaction support using MongoDB sessions

Pagination, filtering, and sorting utilities

Connection pooling configuration

Proper error handling for MongoDB errors

📡 OBSERVABILITY (MANDATORY & FIRST-CLASS)

The project must include full observability support:

🔍 Logging

Structured logging (JSON)

Request/response logging

Correlation IDs (trace IDs)

MongoDB query logging (safe, sanitized)

Log levels per environment

Support for log aggregation (Loki, Datadog, ELK)

📊 Metrics

HTTP request metrics

MongoDB query latency metrics

Error rate metrics

Prometheus-compatible /metrics endpoint

Custom business metrics support

🧵 Tracing

OpenTelemetry integration

HTTP & MongoDB auto-instrumentation

Spans for:

Controllers

Services

Repository/database calls

Exporter-ready (Jaeger, Tempo, Datadog, etc.)

❤️ Health Checks

Liveness probe

Readiness probe

MongoDB connectivity health indicator

External dependency checks

⚙️ DEV EXPERIENCE & AUTOMATION

Include:

NPM scripts for:

dev

build

start:prod

lint

test

test:cov

CI-ready configuration (GitHub Actions friendly)

Dockerfile (multi-stage, production optimized)

.editorconfig

📘 DOCUMENTATION

Provide:

README.md with:

Project overview

Setup instructions

Environment variables

MongoDB connection & schema conventions

Testing strategy

Observability setup & dashboards

Swagger/OpenAPI documentation

Inline documentation for schemas and repositories

📦 OUTPUT REQUIREMENTS

Your response must include:

Project structure (tree view)

Installed dependencies list with reasoning

Key configuration files:

tsconfig.json

.eslintrc

.prettierrc

jest.config.ts

Application bootstrap (main.ts)

Example module with:

Controller

Service

DTOs

Mongoose schema

Repository layer

Example:

Logger setup

Metrics setup

Tracing setup

MongoDB connection setup

Testing examples (unit + integration)

CI/CD & observability integration guidance

🔐 NON-NEGOTIABLE RULES

strict: true TypeScript

No direct Mongoose Model usage in controllers

Repository abstraction is mandatory

Production-safe MongoDB configuration

Observability is built-in, not optional

Latest stable packages only

▶️ START INSTRUCTION

Create a complete NestJS backend project setup using MongoDB + Mongoose with first-class observability that satisfies all the above requirements.

Do not skip steps.
Do not provide partial snippets.
Explain why architectural choices are made.
