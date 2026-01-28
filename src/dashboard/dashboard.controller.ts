import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserDocument } from '../users/user.schema.js';
import { DashboardService, StaffLoad, TodayStats } from './dashboard.service.js';

interface AuthenticatedRequest extends ExpressRequest {
  user: UserDocument;
}

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req: AuthenticatedRequest): Promise<{
    todayStats: TodayStats;
    staffLoad: StaffLoad[];
  }> {
    const userId = req.user._id.toString();

    const [todayStats, staffLoad] = await Promise.all([
      this.dashboardService.getTodayStats(userId),
      this.dashboardService.getStaffLoad(userId),
    ]);

    return {
      todayStats,
      staffLoad,
    };
  }

  @Get('staff-load')
  async getStaffLoad(@Request() req: AuthenticatedRequest): Promise<StaffLoad[]> {
    const userId = req.user._id.toString();
    return this.dashboardService.getStaffLoad(userId);
  }
}
