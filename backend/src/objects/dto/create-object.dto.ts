import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateObjectDto {
  @ApiProperty({
    example: 'ЖК "Солнечный"',
    description: 'Название объекта',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Жилой комплекс из 10 этажей',
    description: 'Описание объекта',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'г. Москва, ул. Ленина, д. 15',
    description: 'Адрес объекта',
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: 'ООО "СтройИнвест"',
    description: 'Клиент/заказчик',
  })
  @IsString()
  client: string;

  @ApiProperty({
    example: 10000000,
    description: 'Бюджет объекта',
    type: 'number',
  })
  @IsNumber()
  budget: number;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Дата начала работ',
    type: 'string',
    format: 'date',
  })
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: '2024-06-30',
    description: 'Дата окончания работ',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    example: 'user-uuid-foreman-id',
    description: 'ID ответственного прораба',
  })
  @IsString()
  responsibleForemanId: string;
}