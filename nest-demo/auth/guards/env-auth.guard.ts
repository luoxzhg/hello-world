import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const envs = this.reflector.get<string[]>('envs', context.getHandler());
    if (!envs) {
      return true;
    }
    return envs.includes(this.configService.get('ENV'));
  }
}
