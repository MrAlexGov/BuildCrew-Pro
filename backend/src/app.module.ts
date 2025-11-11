import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ObjectsModule } from './objects/objects.module';
import { CrewsModule } from './crews/crews.module';
import { TasksModule } from './tasks/tasks.module';
import { ReportsModule } from './reports/reports.module';
import { FilesModule } from './files/files.module';
import { join } from 'path';

@Module({
  imports: [
    // Конфигурация
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // База данных
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_DATABASE', 'buildcrew_pro'),
        entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
        synchronize: configService.get('DB_SYNC', true), // Только для разработки
        logging: configService.get('DB_LOGGING', false),
      }),
    }),
    
    // Модули приложения
    AuthModule,
    UsersModule,
    ObjectsModule,
    CrewsModule,
    TasksModule,
    ReportsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}