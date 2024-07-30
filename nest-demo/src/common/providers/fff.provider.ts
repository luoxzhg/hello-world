import { FffService } from '@app/fff';
import { ConfigService } from '@nestjs/config';

export const FffProvider = {
  provide: FffService,
  useFactory: (configService: ConfigService) =>
    new FffService(
      configService.get('FFF_URL'),
      configService.get('INTERAL_REQUEST_TOKEN'),
    ),
  inject: [ConfigService],
};
