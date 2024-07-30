import { FmmService } from '@app/fmm';
import { ConfigService } from '@nestjs/config';

export const FmmProvider = {
  provide: FmmService,
  useFactory: (configService: ConfigService) =>
    new FmmService(configService.get('FMM_BACKEND')),
  inject: [ConfigService],
};
