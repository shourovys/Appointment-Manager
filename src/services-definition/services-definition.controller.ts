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
import type { CreateServiceDto } from './dto/create-service.dto.js';
import type { UpdateServiceDto } from './dto/update-service.dto.js';
import { ServiceDefinition } from './service-definition.schema.js';
import { ServicesDefinitionService } from './services-definition.service.js';

interface RequestWithUser extends ExpressRequest {
  user: UserDocument;
}

@Controller('services-definition')
@UseGuards(JwtAuthGuard)
export class ServicesDefinitionController {
  constructor(private readonly servicesDefinitionService: ServicesDefinitionService) {}

  @Post()
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Request() req: RequestWithUser,
  ): Promise<ServiceDefinition> {
    const userId = req.user._id.toString();
    return this.servicesDefinitionService.create(createServiceDto, userId);
  }

  @Get()
  async findAll(@Request() req: RequestWithUser): Promise<ServiceDefinition[]> {
    const userId = req.user._id.toString();
    return this.servicesDefinitionService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<ServiceDefinition | null> {
    const userId = req.user._id.toString();
    return this.servicesDefinitionService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req: RequestWithUser,
  ): Promise<ServiceDefinition | null> {
    const userId = req.user._id.toString();
    return this.servicesDefinitionService.update(id, updateServiceDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: RequestWithUser): Promise<void> {
    const userId = req.user._id.toString();
    await this.servicesDefinitionService.remove(id, userId);
  }
}
