import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['objects', 'crews'],
    });

    if (user && await user.comparePassword(password)) {
      // Исключаем пароль из возвращаемого объекта
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<{ user: any; tokens: AuthTokens }> {
    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };

    return { user, tokens };
  }

  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { email, password, firstName, lastName, role = UserRole.WORKER } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = new UserEntity();
    user.email = email;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;

    await user.hashPassword();
    await this.userRepository.save(user);

    return { message: 'Пользователь успешно зарегистрирован' };
  }

  async refreshToken(user: any): Promise<AuthTokens> {
    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async validateJwt(payload: AuthPayload): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: payload.userId, email: payload.email },
      relations: ['objects', 'crews'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Невалидный токен');
    }

    return user;
  }

  async getUserProfile(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: ['objects', 'crews', 'assignedTasks', 'createdTasks'],
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Исключаем пароль
    delete user.password;
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (!await user.comparePassword(currentPassword)) {
      throw new UnauthorizedException('Неверный текущий пароль');
    }

    user.password = newPassword;
    await user.hashPassword();
    await this.userRepository.save(user);

    return { message: 'Пароль успешно изменен' };
  }
}