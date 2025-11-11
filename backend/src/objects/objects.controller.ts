import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { UpdateObjectDto } from './dto/update-object.dto';
import { ObjectEntity } from '../entities/object.entity';

@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получение списка объектов' })
  @ApiResponse({ status: 200, description: 'Список объектов' })
  async findAll(): Promise<ObjectEntity[]> {
    return this.objectsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получение объекта по ID' })
  @ApiResponse({ status: 200, description: 'Информация об объекте' })
  async findOne(@Param('id') id: string): Promise<ObjectEntity> {
    return this.objectsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Создание нового объекта' })
  @ApiResponse({ status: 201, description: 'Объект создан' })
  async create(@Body() createObjectDto: CreateObjectDto): Promise<ObjectEntity> {
    return this.objectsService.create(createObjectDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Обновление объекта' })
  @ApiResponse({ status: 200, description: 'Объект обновлен' })
  async update(
    @Param('id') id: string,
    @Body() updateObjectDto: UpdateObjectDto,
  ): Promise<ObjectEntity> {
    return this.objectsService.update(id, updateObjectDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Удаление объекта' })
  @ApiResponse({ status: 200, description: 'Объект удален' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.objectsService.remove(id);
  }

  @Get('foreman/:foremanId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получение объектов прораба' })
  @ApiResponse({ status: 200, description: 'Объекты прораба' })
  async findByForeman(@Param('foremanId') foremanId: string): Promise<ObjectEntity[]> {
    return this.objectsService.findByForeman(foremanId);
  }

  @Get(':id/tasks')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получение задач объекта' })
  @ApiResponse({ status: 200, description: 'Задачи объекта' })
  async getObjectTasks(@Param('id') objectId: string): Promise<any[]> {
    return this.objectsService.getObjectTasks(objectId);
  }

  @Get(':id/progress')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получение прогресса объекта' })
  @ApiResponse({ status: 200, description: 'Прогресс выполнения объекта' })
  async getObjectProgress(@Param('id') objectId: string): Promise<{ progress: number; completedTasks: number; totalTasks: number }> {
    return this.objectsService.getObjectProgress(objectId);
  }
}