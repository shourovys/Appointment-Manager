import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Appointment,
  AppointmentDocument,
  AppointmentStatus,
} from '../appointments/appointment.schema.js';
import { AvailabilityStatus, Staff, StaffDocument } from '../staff/staff.schema.js';

export interface TodayStats {
  totalAppointments: number;
  completed: number;
  pending: number;
  waitingQueueCount: number;
}

export interface StaffLoad {
  staffId: string;
  name: string;
  current: number;
  max: number;
  status: string;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
  ) {}

  async getTodayStats(userId: string): Promise<TodayStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await this.appointmentModel
      .find({
        userId,
        appointmentDate: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .exec();

    const totalAppointments = appointments.length;
    const completed = appointments.filter((a) => a.status === AppointmentStatus.COMPLETED).length;
    const pending = appointments.filter((a) => a.status === AppointmentStatus.SCHEDULED).length;
    const waitingQueueCount = appointments.filter(
      (a) => a.status === AppointmentStatus.WAITING,
    ).length;

    return {
      totalAppointments,
      completed,
      pending,
      waitingQueueCount,
    };
  }

  async getStaffLoad(userId: string): Promise<StaffLoad[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const staffList = await this.staffModel.find({ userId }).exec();

    const staffLoads: StaffLoad[] = [];

    for (const staff of staffList) {
      const appointmentsToday = await this.appointmentModel
        .countDocuments({
          staffId: staff._id,
          appointmentDate: {
            $gte: today,
            $lt: tomorrow,
          },
          status: AppointmentStatus.SCHEDULED,
        })
        .exec();

      let status = 'Available';
      if (staff.availabilityStatus === AvailabilityStatus.ON_LEAVE) {
        status = 'On Leave';
      } else if (appointmentsToday >= staff.dailyCapacity) {
        status = 'Booked';
      } else if (appointmentsToday >= staff.dailyCapacity - 1) {
        status = 'Near Capacity';
      }

      staffLoads.push({
        staffId: staff._id.toString(),
        name: staff.name,
        current: appointmentsToday,
        max: staff.dailyCapacity,
        status,
      });
    }

    return staffLoads;
  }
}
