import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserDocument } from '../users/user.schema.js';
import { Appointment, AppointmentDocument, AppointmentStatus } from './appointment.schema.js';
import { AppointmentsService } from './appointments.service.js';
import type { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import type { UpdateAppointmentDto } from './dto/update-appointment.dto.js';

interface AuthenticatedRequest extends ExpressRequest {
  user: UserDocument;
}

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Appointment> {
    const userId = req.user._id.toString();
    return this.appointmentsService.create(createAppointmentDto, userId);
  }

  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query() filters: { date?: string; staffId?: string; status?: string },
  ): Promise<Appointment[]> {
    const userId = req.user._id.toString();
    return this.appointmentsService.findAll(userId, filters);
  }

  @Get('queue')
  async getQueue(@Request() req: AuthenticatedRequest): Promise<AppointmentDocument[]> {
    const userId = req.user._id.toString();
    return this.appointmentsService.getQueue(userId);
  }

  @Post('queue/assign/:staffId')
  async assignFromQueue(
    @Param('staffId') staffId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Appointment | null> {
    const userId = req.user._id.toString();
    return this.appointmentsService.assignFromQueue(staffId, userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Appointment> {
    const userId = req.user._id.toString();
    return this.appointmentsService.findOne(id, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<Appointment> {
    const userId = req.user._id.toString();
    return this.appointmentsService.update(id, updateAppointmentDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Appointment> {
    const userId = req.user._id.toString();
    return this.appointmentsService.remove(id, userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
    @Request() req: AuthenticatedRequest,
  ): Promise<Appointment> {
    const userId = req.user._id.toString();
    return this.appointmentsService.updateStatus(id, status, userId);
  }
}
