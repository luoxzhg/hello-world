import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}


  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // T 用户必须具有所有 role 才能访问 ？？？
    // 用户具有任一 role 都能访问，如何设计呢
    let valid = true;
    for (let i = 0; i < roles.length; i++) {
      if (!user.roles.includes(roles[i])) {
        valid = false;
        break;
      }
    }
    return valid;
  }
}
