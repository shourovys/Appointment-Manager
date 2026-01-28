import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserDocument } from '../users/user.schema.js';
import { ActivityLog } from './activity-log.schema.js';
import { ActivityLogService } from './activity-log.service.js';

interface AuthenticatedRequest extends ExpressRequest {
  user: UserDocument;
}

@Controller('activity-logs')
@UseGuards(JwtAuthGuard)
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  async getRecentLogs(@Request() req: AuthenticatedRequest): Promise<ActivityLog[]> {
    const userId = req.user._id.toString();
    return this.activityLogService.getRecentLogs(userId);
  }
}
