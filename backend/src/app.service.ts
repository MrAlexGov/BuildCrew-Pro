import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: '🚀 BuildCrew Pro API',
      version: '1.0.0',
      timestamp: new Date(),
    };
  }
}