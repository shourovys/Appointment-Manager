import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { ServiceDefinition, ServiceDefinitionDocument } from './service-definition.schema.js';

@Injectable()
export class ServicesDefinitionService {
  constructor(
    @InjectModel(ServiceDefinition.name) private serviceModel: Model<ServiceDefinitionDocument>,
  ) {}

  async create(createServiceDto: CreateServiceDto, userId: string): Promise<ServiceDefinition> {
    const createdService = new this.serviceModel({ ...createServiceDto, userId });
    return createdService.save();
  }

  async findAll(userId: string): Promise<ServiceDefinition[]> {
    return this.serviceModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<ServiceDefinition> {
    const service = await this.serviceModel.findOne({ _id: id, userId }).exec();
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    userId: string,
  ): Promise<ServiceDefinition> {
    const existingService = await this.serviceModel
      .findOneAndUpdate({ _id: id, userId }, updateServiceDto, { new: true })
      .exec();
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }
    return existingService;
  }

  async remove(id: string, userId: string): Promise<ServiceDefinition> {
    const result = await this.serviceModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!result) {
      throw new NotFoundException('Service not found');
    }
    return result;
  }
}
