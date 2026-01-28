import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityAction, ActivityLog, ActivityLogDocument } from './activity-log.schema.js';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(ActivityLog.name) private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async createLog(
    action: ActivityAction,
    description: string,
    appointmentId: string,
    userId: string,
    staffId?: string,
  ): Promise<ActivityLog> {
    const log = new this.activityLogModel({
      action,
      description,
      appointmentId,
      staffId,
      userId,
    });
    return log.save();
  }

  async getRecentLogs(userId: string, limit = 10): Promise<ActivityLog[]> {
    return this.activityLogModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('appointmentId')
      .populate('staffId')
      .exec();
  }
}
