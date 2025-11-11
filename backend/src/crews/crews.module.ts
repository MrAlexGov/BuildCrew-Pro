import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrewsController } from './crews.controller';
import { CrewsService } from './crews.service';
import { CrewEntity } from '../entities/crew.entity';
import { UserEntity } from '../entities/user.entity';
import { ObjectEntity } from '../entities/object.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CrewEntity, UserEntity, ObjectEntity])],
  controllers: [CrewsController],
  providers: [CrewsService],
  exports: [CrewsService],
})
export class CrewsModule {}