import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogService } from '../activity-log/activity-log.service.js';
import { ServicesDefinitionService } from '../services-definition/services-definition.service.js';
import { StaffService } from '../staff/staff.service.js';
import { Appointment, AppointmentStatus } from './appointment.schema.js';
import { AppointmentsService } from './appointments.service.js';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let mockAppointmentModel: any;
  let mockActivityLogService: any;
  let mockServicesDefinitionService: any;
  let mockStaffService: any;

  beforeEach(async () => {
    mockAppointmentModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
      countDocuments: jest.fn(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      save: jest.fn(),
      constructor: jest.fn(),
    };

    mockActivityLogService = {
      createLog: jest.fn(),
    };

    mockServicesDefinitionService = {
      findOne: jest.fn(),
    };

    mockStaffService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getModelToken(Appointment.name),
          useValue: mockAppointmentModel,
        },
        {
          provide: ActivityLogService,
          useValue: mockActivityLogService,
        },
        {
          provide: ServicesDefinitionService,
          useValue: mockServicesDefinitionService,
        },
        {
          provide: StaffService,
          useValue: mockStaffService,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create appointment successfully', async () => {
      const createDto = {
        customerName: 'John Doe',
        serviceId: 'service1',
        staffId: 'staff1',
        appointmentDate: '2024-01-01',
        appointmentTime: '10:00',
      };
      const userId = 'user1';

      mockServicesDefinitionService.findOne.mockResolvedValue({ _id: 'service1' });
      mockAppointmentModel.find.mockResolvedValue([]);
      mockStaffService.findOne.mockResolvedValue({ dailyCapacity: 5 });
      mockAppointmentModel.countDocuments.mockResolvedValue(2);
      mockAppointmentModel.save = jest.fn().mockResolvedValue({
        ...createDto,
        _id: 'appt1',
        status: AppointmentStatus.SCHEDULED,
      });

      const result = await service.create(createDto, userId);

      expect(result).toBeDefined();
      expect(result.status).toBe(AppointmentStatus.SCHEDULED);
    });

    it('should throw error for time conflict', async () => {
      const createDto = {
        customerName: 'John Doe',
        serviceId: 'service1',
        staffId: 'staff1',
        appointmentDate: '2024-01-01',
        appointmentTime: '10:00',
      };
      const userId = 'user1';

      mockServicesDefinitionService.findOne.mockResolvedValue({ _id: 'service1' });
      mockAppointmentModel.find.mockResolvedValue([{ _id: 'existing', appointmentTime: '10:00' }]);

      await expect(service.create(createDto, userId)).rejects.toThrow(BadRequestException);
    });

    it('should assign to queue when at capacity', async () => {
      const createDto = {
        customerName: 'John Doe',
        serviceId: 'service1',
        staffId: 'staff1',
        appointmentDate: '2024-01-01',
        appointmentTime: '10:00',
      };
      const userId = 'user1';

      mockServicesDefinitionService.findOne.mockResolvedValue({ _id: 'service1' });
      mockAppointmentModel.find.mockResolvedValue([]);
      mockStaffService.findOne.mockResolvedValue({ dailyCapacity: 5 });
      mockAppointmentModel.countDocuments.mockResolvedValue(5); // At capacity
      mockAppointmentModel.find.mockResolvedValueOnce([]); // For queue position
      mockAppointmentModel.save = jest.fn().mockResolvedValue({
        ...createDto,
        _id: 'appt1',
        status: AppointmentStatus.WAITING,
        queuePosition: 1,
      });

      const result = await service.create(createDto, userId);

      expect(result.status).toBe(AppointmentStatus.WAITING);
      expect(result.queuePosition).toBe(1);
    });
  });

  describe('assignFromQueue', () => {
    it('should assign from queue successfully', async () => {
      const userId = 'user1';
      const staffId = 'staff1';
      const mockAppointment = {
        _id: 'appt1',
        customerName: 'John Doe',
        appointmentDate: new Date('2024-01-01'),
        appointmentTime: '10:00',
        status: AppointmentStatus.WAITING,
        save: jest.fn().mockResolvedValue(true),
      };

      mockAppointmentModel.find.mockResolvedValue([mockAppointment]);
      mockStaffService.findOne.mockResolvedValue({ dailyCapacity: 5 });
      mockAppointmentModel.countDocuments.mockResolvedValue(2);
      mockAppointmentModel.find.mockResolvedValueOnce([]); // No conflict

      const result = await service.assignFromQueue(staffId, userId);

      expect(result).toBeDefined();
      expect(mockAppointment.status).toBe(AppointmentStatus.SCHEDULED);
      expect(mockActivityLogService.createLog).toHaveBeenCalled();
    });

    it('should return null when queue is empty', async () => {
      const userId = 'user1';
      const staffId = 'staff1';

      mockAppointmentModel.find.mockResolvedValue([]);

      const result = await service.assignFromQueue(staffId, userId);

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return appointment if found', async () => {
      const mockAppointment = { _id: 'appt1', customerName: 'John Doe' };
      mockAppointmentModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockAppointment),
      });

      const result = await service.findOne('appt1', 'user1');

      expect(result).toBe(mockAppointment);
    });

    it('should throw NotFoundException if not found', async () => {
      mockAppointmentModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('appt1', 'user1')).rejects.toThrow(NotFoundException);
    });
  });
});
