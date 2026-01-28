import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ActivityAction } from '../activity-log/activity-log.schema.js';
import { ActivityLogService } from '../activity-log/activity-log.service.js';
import { ServicesDefinitionService } from '../services-definition/services-definition.service.js';
import { StaffService } from '../staff/staff.service.js';
import { Appointment, AppointmentDocument, AppointmentStatus } from './appointment.schema.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    private staffService: StaffService,
    private servicesDefinitionService: ServicesDefinitionService,
    private activityLogService: ActivityLogService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: string): Promise<Appointment> {
    const { serviceId, staffId, appointmentDate, appointmentTime } = createAppointmentDto;

    // Validate appointment is in the future
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      throw new BadRequestException('Appointment date and time must be in the future');
    }

    // Validate service exists
    const service = await this.servicesDefinitionService.findOne(serviceId, userId);
    if (!service) {
      throw new BadRequestException('Service not found');
    }

    let assignedStaffId = staffId;
    let status = AppointmentStatus.SCHEDULED;
    let queuePosition: number | undefined;

    if (staffId) {
      // Check conflict
      const conflict = await this.checkConflict(
        staffId,
        new Date(appointmentDate),
        appointmentTime,
      );
      if (conflict) {
        throw new BadRequestException('Time conflict with existing appointment');
      }

      // Check capacity
      const capacityOk = await this.checkCapacity(staffId, new Date(appointmentDate), userId);
      if (!capacityOk) {
        // Assign to queue
        status = AppointmentStatus.WAITING;
        queuePosition = await this.getNextQueuePosition(userId);
        assignedStaffId = undefined;
      }
    } else {
      // No staff specified, assign to queue
      status = AppointmentStatus.WAITING;
      queuePosition = await this.getNextQueuePosition(userId);
    }

    const createdAppointment = new this.appointmentModel({
      ...createAppointmentDto,
      serviceId,
      staffId: assignedStaffId,
      appointmentDate: new Date(appointmentDate),
      status,
      queuePosition,
      userId,
    });
    return createdAppointment.save();
  }

  async findAll(
    userId: string,
    filters?: { date?: string; staffId?: string; status?: string },
  ): Promise<Appointment[]> {
    const query: Record<string, unknown> = { userId };
    if (filters?.date) {
      query.appointmentDate = new Date(filters.date);
    }
    if (filters?.staffId) {
      query.staffId = filters.staffId;
    }
    if (filters?.status) {
      query.status = filters.status;
    }
    return this.appointmentModel.find(query).populate('serviceId').populate('staffId').exec();
  }

  async findOne(id: string, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findOne({ _id: id, userId })
      .populate('serviceId')
      .populate('staffId')
      .exec();
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    userId: string,
  ): Promise<Appointment> {
    // Similar conflict check if changing time/staff
    const existingAppointment = await this.findOne(id, userId);
    const updatedData = { ...updateAppointmentDto };

    if (
      updateAppointmentDto.appointmentDate ||
      updateAppointmentDto.appointmentTime ||
      updateAppointmentDto.staffId
    ) {
      const date = updateAppointmentDto.appointmentDate
        ? new Date(updateAppointmentDto.appointmentDate)
        : existingAppointment.appointmentDate;
      const time = updateAppointmentDto.appointmentTime || existingAppointment.appointmentTime;
      const staffId = updateAppointmentDto.staffId || existingAppointment.staffId?.toString();

      // Validate updated appointment is in the future
      const newDateTime = new Date(date);
      const [hours, minutes] = time.split(':').map(Number);
      newDateTime.setHours(hours, minutes, 0, 0);
      if (newDateTime <= new Date()) {
        throw new BadRequestException('Updated appointment date and time must be in the future');
      }

      if (staffId) {
        const conflict = await this.checkConflict(staffId, date, time);
        if (conflict && conflict._id.toString() !== id) {
          throw new BadRequestException('Time conflict with existing appointment');
        }
      }
    }

    const updatedAppointment = await this.appointmentModel
      .findOneAndUpdate({ _id: id, userId }, updatedData, { new: true })
      .exec();
    if (!updatedAppointment) {
      throw new NotFoundException('Appointment not found');
    }
    return updatedAppointment;
  }

  async remove(id: string, userId: string): Promise<Appointment> {
    const result = await this.appointmentModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!result) {
      throw new NotFoundException('Appointment not found');
    }
    return result;
  }

  async updateStatus(id: string, status: AppointmentStatus, userId: string): Promise<Appointment> {
    const updatedAppointment = await this.appointmentModel
      .findOneAndUpdate({ _id: id, userId }, { status }, { new: true })
      .exec();
    if (!updatedAppointment) {
      throw new NotFoundException('Appointment not found');
    }
    return updatedAppointment;
  }

  private async checkConflict(
    staffId: string,
    date: Date,
    time: string,
  ): Promise<AppointmentDocument | null> {
    // Simple check: assume duration in minutes, check overlapping times
    // For simplicity, check if any appointment for staff on date has same time
    const appointments = await this.appointmentModel
      .find({
        staffId,
        appointmentDate: date,
        status: { $in: [AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED] },
      })
      .exec();

    for (const appt of appointments) {
      if (appt.appointmentTime === time) {
        return appt;
      }
    }
    return null;
  }

  private async checkCapacity(staffId: string, date: Date, userId: string): Promise<boolean> {
    const staff = await this.staffService.findOne(staffId, userId);
    const appointments = await this.appointmentModel
      .countDocuments({
        staffId,
        appointmentDate: date,
        status: AppointmentStatus.SCHEDULED,
      })
      .exec();
    return appointments < staff.dailyCapacity;
  }

  private async getNextQueuePosition(userId: string): Promise<number> {
    const maxPosition = await this.appointmentModel
      .find({ userId, status: AppointmentStatus.WAITING })
      .sort({ queuePosition: -1 })
      .limit(1)
      .exec();
    return maxPosition.length > 0 ? (maxPosition[0].queuePosition || 0) + 1 : 1;
  }

  async getQueue(userId: string): Promise<AppointmentDocument[]> {
    return this.appointmentModel
      .find({ userId, status: AppointmentStatus.WAITING })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .exec();
  }

  async assignFromQueue(staffId: string, userId: string): Promise<Appointment | null> {
    const queue = await this.getQueue(userId);
    if (queue.length === 0) return null;

    const appointment = queue[0];

    // Check capacity
    const capacityOk = await this.checkCapacity(staffId, appointment.appointmentDate, userId);
    if (!capacityOk) return null;

    // Check conflict
    const conflict = await this.checkConflict(
      staffId,
      appointment.appointmentDate,
      appointment.appointmentTime,
    );
    if (conflict) return null;

    // Assign
    appointment.staffId = new mongoose.Types.ObjectId(staffId);
    appointment.status = AppointmentStatus.SCHEDULED;
    appointment.queuePosition = undefined;
    await appointment.save();

    // Log the assignment
    await this.activityLogService.createLog(
      ActivityAction.QueueToStaff,
      `Appointment for "${appointment.customerName}" auto-assigned to staff.`,
      appointment._id.toString(),
      userId,
      staffId,
    );

    // Recalculate queue positions
    await this.recalculateQueuePositions(userId);

    return appointment;
  }

  private async recalculateQueuePositions(userId: string): Promise<void> {
    const queue = await this.appointmentModel
      .find({ userId, status: AppointmentStatus.WAITING })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .exec();
    for (let i = 0; i < queue.length; i++) {
      queue[i].queuePosition = i + 1;
      await queue[i].save();
    }
  }
}
