import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ServicesDefinitionService } from '../services-definition/services-definition.service.js';
import { StaffService } from '../staff/staff.service.js';
import { UserDocument, UserRole } from '../users/user.schema.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private usersService: UsersService,
    private servicesDefinitionService: ServicesDefinitionService,
    private staffService: StaffService,
  ) {}

  async onModuleInit(): Promise<void> {
    const user = await this.seedDemoUser();
    await this.seedDemoServices(user.id);
    await this.seedDemoStaff(user.id);
  }

  private async seedDemoUser(): Promise<UserDocument> {
    const demoEmail = 'demo@example.com';
    const demoPassword = 'demo123';
    const demoName = 'Demo User';

    const existingUser = await this.usersService.findByEmail(demoEmail);
    if (!existingUser) {
      this.logger.log(`Seeding demo user: ${demoEmail}`);
      const newUser = await this.usersService.createUser(demoEmail, demoPassword, demoName);
      newUser.role = UserRole.ADMIN;
      return await newUser.save();
    } else {
      this.logger.log('Demo user already exists');
      return existingUser;
    }
  }

  private async seedDemoServices(userId: string): Promise<void> {
    const services = [
      { name: 'General Consultation', duration: 30 as const, requiredStaffType: 'General' },
      { name: 'Specialist Consultation', duration: 60 as const, requiredStaffType: 'Specialist' },
      { name: 'Quick Check-up', duration: 15 as const, requiredStaffType: 'General' },
    ];

    const existingServices = await this.servicesDefinitionService.findAll(userId);
    const existingNames = existingServices.map((s) => s.name);

    for (const service of services) {
      if (!existingNames.includes(service.name)) {
        this.logger.log(`Seeding service: ${service.name}`);
        await this.servicesDefinitionService.create(service, userId);
      }
    }
  }

  private async seedDemoStaff(userId: string): Promise<void> {
    const staff = [
      { name: 'Dr. John Doe', serviceType: 'General', dailyCapacity: 5 },
      { name: 'Dr. Jane Smith', serviceType: 'Specialist', dailyCapacity: 3 },
      { name: 'Nurse Alice', serviceType: 'General', dailyCapacity: 8 },
    ];

    const existingStaff = await this.staffService.findAll(userId);
    const existingNames = existingStaff.map((s) => s.name);

    for (const member of staff) {
      if (!existingNames.includes(member.name)) {
        this.logger.log(`Seeding staff: ${member.name}`);
        await this.staffService.create(
          {
            ...member,
            availabilityStatus: 'Available',
          },
          userId,
        );
      }
    }
  }
}
