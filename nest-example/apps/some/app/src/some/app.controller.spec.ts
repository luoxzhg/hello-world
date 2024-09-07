import { Test, TestingModule } from '@nestjs/testing';
import { Some/appController } from './some/app.controller';
import { Some/appService } from './some/app.service';

describe('Some/appController', () => {
  let some/appController: Some/appController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Some/appController],
      providers: [Some/appService],
    }).compile();

    some/appController = app.get<Some/appController>(Some/appController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(some/appController.getHello()).toBe('Hello World!');
    });
  });
});
