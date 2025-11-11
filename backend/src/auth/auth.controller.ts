import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Аутентификация пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно аутентифицирован' })
  async login(@Body() loginDto: LoginDto) {
    const { user } = await this.authService.login(loginDto);
    return user;
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Обновление JWT токена' })
  @ApiResponse({ status: 200, description: 'Токен успешно обновлен' })
  async refreshToken(@Body() { user }) {
    return this.authService.refreshToken(user);
  }

  @Post('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получение профиля пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя' })
  async getProfile(@Body() { userId }) {
    return this.authService.getUserProfile(userId);
  }
}