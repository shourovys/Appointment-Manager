import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceDefinition, ServiceDefinitionSchema } from './service-definition.schema.js';
import { ServicesDefinitionController } from './services-definition.controller.js';
import { ServicesDefinitionService } from './services-definition.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ServiceDefinition.name, schema: ServiceDefinitionSchema }]),
  ],
  controllers: [ServicesDefinitionController],
  providers: [ServicesDefinitionService],
  exports: [ServicesDefinitionService],
})
export class ServicesDefinitionModule {}
