import { Module } from '@nestjs/common';
import { Some/appController } from './some/app.controller';
import { Some/appService } from './some/app.service';

@Module({
  imports: [],
  controllers: [Some/appController],
  providers: [Some/appService],
})
export class Some/appModule {}
