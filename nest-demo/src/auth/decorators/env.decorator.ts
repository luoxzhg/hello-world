import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { EnvGuard } from '../guards/env-auth.guard';

export function Env(...envs: string[]) {
  return applyDecorators(SetMetadata('envs', envs), UseGuards(EnvGuard));
}
