import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityLogModule } from './activity-log/activity-log.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { AuthModule } from './auth/auth.module.js';
import { validateEnvironment } from './config/validation.schema.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { ServicesDefinitionModule } from './services-definition/services-definition.module.js';
import { StaffModule } from './staff/staff.module.js';

@Module({
  imports: [
    // Global configuration module with environment validation
    ConfigModule.forRoot({
      isGlobal: true,
      // Load environment-specific .env files
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
        '.env',
      ],
      // Validate environment variables using Zod schema
      validate: validateEnvironment,
      // Cache configuration for better performance
      cache: true,
      // Expand environment variables (e.g., $PORT -> actual port)
      expandVariables: true,
    }),
    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB_NAME!,
    }),
    AuthModule,
    ServicesDefinitionModule,
    StaffModule,
    AppointmentsModule,
    ActivityLogModule,
    DashboardModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
