import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CrewsService } from './crews.service';
import { CreateCrewDto } from './dto/create-crew.dto';
import { UpdateCrewDto } from './dto/update-crew.dto';
import { CrewEntity } from '../entities/crew.entity';

@ApiTags('Crews')
@Controller('crews')
export class CrewsController {
  constructor(private readonly crewsService: CrewsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получение списка бригад' })
  @ApiResponse({ status: 200, description: 'Список бригад' })
  async findAll(): Promise<CrewEntity[]> {
    return this.crewsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получение бригады по ID' })
  @ApiResponse({ status: 200, description: 'Информация о бригаде' })
  async findOne(@Param('id') id: string): Promise<CrewEntity> {
    return this.crewsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Создание новой бригады' })
  @ApiResponse({ status: 201, description: 'Бригада создана' })
  async create(@Body() createCrewDto: CreateCrewDto): Promise<CrewEntity> {
    return this.crewsService.create(createCrewDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Обновление бригады' })
  @ApiResponse({ status: 200, description: 'Бригада обновлена' })
  async update(
    @Param('id') id: string,
    @Body() updateCrewDto: UpdateCrewDto,
  ): Promise<CrewEntity> {
    return this.crewsService.update(id, updateCrewDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Удаление бригады' })
  @ApiResponse({ status: 200, description: 'Бригада удалена' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.crewsService.remove(id);
  }

  @Post(':id/members/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Добавление сотрудника в бригаду' })
  @ApiResponse({ status: 200, description: 'Сотрудник добавлен в бригаду' })
  async addMember(@Param('id') crewId: string, @Param('userId') userId: string): Promise<CrewEntity> {
    return this.crewsService.addMember(crewId, userId);
  }

  @Delete(':id/members/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Удаление сотрудника из бригады' })
  @ApiResponse({ status: 200, description: 'Сотрудник удален из бригады' })
  async removeMember(@Param('id') crewId: string, @Param('userId') userId: string): Promise<CrewEntity> {
    return this.crewsService.removeMember(crewId, userId);
  }

  @Get(':id/members')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получение членов бригады' })
  @ApiResponse({ status: 200, description: 'Члены бригады' })
  async getMembers(@Param('id') crewId: string): Promise<any[]> {
    return this.crewsService.getMembers(crewId);
  }

  @Get(':id/objects')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Получение объектов бригады' })
  @ApiResponse({ status: 200, description: 'Объекты бригады' })
  async getObjects(@Param('id') crewId: string): Promise<any[]> {
    return this.crewsService.getObjects(crewId);
  }
}