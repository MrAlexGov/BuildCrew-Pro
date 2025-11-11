import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectEntity } from '../entities/object.entity';
import { UserEntity } from '../entities/user.entity';
import { CrewEntity } from '../entities/crew.entity';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectRepository(ObjectEntity)
    private objectRepository: Repository<ObjectEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CrewEntity)
    private crewRepository: Repository<CrewEntity>,
  ) {}

  async findAll(): Promise<ObjectEntity[]> {
    return this.objectRepository.find({
      where: { isActive: true },
      relations: ['responsibleForeman', 'crews', 'tasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ObjectEntity> {
    const object = await this.objectRepository.find({
      where: { id, isActive: true },
      relations: ['responsibleForeman', 'crews', 'tasks'],
    });

    if (!object) {
      throw new NotFoundException('Объект не найден');
    }

    return object;
  }

  async findByForeman(foremanId: string): Promise<ObjectEntity[]> {
    return this.objectRepository.find({
      where: { responsibleForemanId: foremanId, isActive: true },
      relations: ['crews', 'tasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createObjectDto: CreateObjectDto): Promise<ObjectEntity> {
    const { name, description, address, client, budget, startDate, endDate, responsibleForemanId } = createObjectDto;

    const foreman = await this.userRepository.findOne({ where: { id: responsibleForemanId, role: 'foreman' } });
    if (!foreman) {
      throw new BadRequestException('Прораб не найден');
    }

    const object = this.objectRepository.create({
      name,
      description,
      address,
      client,
      budget,
      startDate,
      endDate,
      responsibleForeman: foreman,
      responsibleForemanId,
    });

    return this.objectRepository.save(object);
  }

  async update(id: string, updateObjectDto: UpdateObjectDto): Promise<ObjectEntity> {
    const object = await this.objectRepository.findOne({ where: { id } });
    
    if (!object) {
      throw new NotFoundException('Объект не найден');
    }

    if (updateObjectDto.responsibleForemanId) {
      const foreman = await this.userRepository.findOne({ where: { id: updateObjectDto.responsibleForemanId, role: 'foreman' } });
      if (!foreman) {
        throw new BadRequestException('Прораб не найден');
      }
      object.responsibleForeman = foreman;
      object.responsibleForemanId = updateObjectDto.responsibleForemanId;
    }

    Object.assign(object, updateObjectDto);
    return this.objectRepository.save(object);
  }

  async remove(id: string): Promise<void> {
    const result = await this.objectRepository.softDelete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException('Объект не найден');
    }
  }

  async getObjectTasks(objectId: string): Promise<any[]> {
    const object = await this.objectRepository.findOne({
      where: { id: objectId },
      relations: ['tasks', 'tasks.assignee', 'tasks.crew'],
    });

    if (!object) {
      throw new NotFoundException('Объект не найден');
    }

    return object.tasks;
  }

  async getObjectProgress(objectId: string): Promise<{ progress: number; completedTasks: number; totalTasks: number }> {
    const tasks = await this.getObjectTasks(objectId);
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { progress, completedTasks, totalTasks };
  }

  async assignCrew(objectId: string, crewId: string): Promise<ObjectEntity> {
    const object = await this.objectRepository.findOne({ where: { id: objectId } });
    const crew = await this.crewRepository.findOne({ where: { id: crewId } });

    if (!object || !crew) {
      throw new NotFoundException('Объект или бригада не найдены');
    }

    if (!object.crews) {
      object.crews = [];
    }

    if (!object.crews.find(c => c.id === crewId)) {
      object.crews.push(crew);
    }

    return this.objectRepository.save(object);
  }

  async unassignCrew(objectId: string, crewId: string): Promise<ObjectEntity> {
    const object = await this.objectRepository.findOne({ where: { id: objectId } });
    
    if (!object) {
      throw new NotFoundException('Объект не найден');
    }

    if (object.crews) {
      object.crews = object.crews.filter(c => c.id !== crewId);
      return this.objectRepository.save(object);
    }

    return object;
  }
}