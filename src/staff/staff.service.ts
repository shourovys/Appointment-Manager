import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStaffDto } from './dto/create-staff.dto.js';
import { UpdateStaffDto } from './dto/update-staff.dto.js';
import { Staff, StaffDocument } from './staff.schema.js';

@Injectable()
export class StaffService {
  constructor(@InjectModel(Staff.name) private staffModel: Model<StaffDocument>) {}

  async create(createStaffDto: CreateStaffDto, userId: string): Promise<Staff> {
    const createdStaff = new this.staffModel({ ...createStaffDto, userId });
    return createdStaff.save();
  }

  async findAll(userId: string): Promise<Staff[]> {
    return this.staffModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Staff> {
    const staff = await this.staffModel.findOne({ _id: id, userId }).exec();
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }
    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto, userId: string): Promise<Staff> {
    const existingStaff = await this.staffModel
      .findOneAndUpdate({ _id: id, userId }, updateStaffDto, { new: true })
      .exec();
    if (!existingStaff) {
      throw new NotFoundException('Staff member not found');
    }
    return existingStaff;
  }

  async remove(id: string, userId: string): Promise<Staff> {
    const result = await this.staffModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!result) {
      throw new NotFoundException('Staff member not found');
    }
    return result;
  }
}
