import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserDocument } from '../users/user.schema.js';
import type { CreateStaffDto } from './dto/create-staff.dto.js';
import type { UpdateStaffDto } from './dto/update-staff.dto.js';
import { Staff } from './staff.schema.js';
import { StaffService } from './staff.service.js';

interface RequestWithUser extends ExpressRequest {
  user: UserDocument;
}

@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async create(
    @Body() createStaffDto: CreateStaffDto,
    @Request() req: RequestWithUser,
  ): Promise<Staff> {
    const userId = req.user._id.toString();
    return this.staffService.create(createStaffDto, userId);
  }

  @Get()
  async findAll(@Request() req: RequestWithUser): Promise<Staff[]> {
    const userId = req.user._id.toString();
    return this.staffService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: RequestWithUser): Promise<Staff | null> {
    const userId = req.user._id.toString();
    return this.staffService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
    @Request() req: RequestWithUser,
  ): Promise<Staff | null> {
    const userId = req.user._id.toString();
    return this.staffService.update(id, updateStaffDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: RequestWithUser): Promise<void> {
    const userId = req.user._id.toString();
    await this.staffService.remove(id, userId);
  }
}
