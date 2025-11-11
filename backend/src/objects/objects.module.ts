import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectEntity } from '../entities/object.entity';
import { UserEntity } from '../entities/user.entity';
import { CrewEntity } from '../entities/crew.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ObjectEntity, UserEntity, CrewEntity])],
  controllers: [ObjectsController],
  providers: [ObjectsService],
  exports: [ObjectsService],
})
export class ObjectsModule {}