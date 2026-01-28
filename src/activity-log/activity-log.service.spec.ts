import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityAction, ActivityLog } from './activity-log.schema.js';
import { ActivityLogService } from './activity-log.service.js';

describe('ActivityLogService', () => {
  let service: ActivityLogService;
  let mockActivityLogModel: any;

  beforeEach(async () => {
    mockActivityLogModel = {
      find: jest.fn(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      constructor: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogService,
        {
          provide: getModelToken(ActivityLog.name),
          useValue: mockActivityLogModel,
        },
      ],
    }).compile();

    service = module.get<ActivityLogService>(ActivityLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLog', () => {
    it('should create a log successfully', async () => {
      const logData = {
        action: ActivityAction.QueueToStaff,
        description: 'Test log',
        appointmentId: 'appt1',
        userId: 'user1',
        staffId: 'staff1',
      };

      const mockLog = { ...logData, _id: 'log1', timestamp: new Date() };
      mockActivityLogModel.save = jest.fn().mockResolvedValue(mockLog);

      const result = await service.createLog(
        logData.action,
        logData.description,
        logData.appointmentId,
        logData.userId,
        logData.staffId,
      );

      expect(result).toBe(mockLog);
      expect(mockActivityLogModel.save).toHaveBeenCalled();
    });
  });

  describe('getRecentLogs', () => {
    it('should return recent logs', async () => {
      const userId = 'user1';
      const limit = 5;
      const mockLogs = [
        { _id: 'log1', description: 'Log 1' },
        { _id: 'log2', description: 'Log 2' },
      ];

      mockActivityLogModel.exec.mockResolvedValue(mockLogs);

      const result = await service.getRecentLogs(userId, limit);

      expect(result).toBe(mockLogs);
      expect(mockActivityLogModel.find).toHaveBeenCalledWith({ userId });
      expect(mockActivityLogModel.sort).toHaveBeenCalledWith({ timestamp: -1 });
      expect(mockActivityLogModel.limit).toHaveBeenCalledWith(limit);
    });
  });
});
