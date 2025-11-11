import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: { isActive: true },
      relations: ['objects', 'crews'],
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
      relations: ['objects', 'crews', 'assignedTasks', 'createdTasks'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findByRole(role: UserRole): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: { role, isActive: true },
      relations: ['objects', 'crews'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password, firstName, lastName, role = UserRole.WORKER, phone, specialization, grade } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    const user = this.userRepository.create({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      specialization,
      grade,
    });

    await user.hashPassword();
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const { password, ...updateData } = updateUserDto;
    
    Object.assign(user, updateData);

    if (password) {
      user.password = password;
      await user.hashPassword();
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.softDelete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  async getForemanObjects(foremanId: string): Promise<any[]> {
    const foreman = await this.userRepository.findOne({
      where: { id: foremanId, role: UserRole.FOREMAN },
      relations: ['objects'],
    });

    if (!foreman) {
      throw new NotFoundException('Прораб не найден');
    }

    return foreman.objects;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}