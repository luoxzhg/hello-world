import { Controller, Get } from '@nestjs/common';
import { Some/appService } from './some/app.service';

@Controller()
export class Some/appController {
  constructor(private readonly some/appService: Some/appService) {}

  @Get()
  getHello(): string {
    return this.some/appService.getHello();
  }
}
