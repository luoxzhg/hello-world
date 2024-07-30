import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class ProductAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const products = this.reflector.get<string[]>('products', context.getHandler())
    if (!products) {
      return true
    }

    const req = context.switchToHttp().getRequest()
    const user = req.user

    // 管理员不需要授权
    if (user.roles.includes('staff')) {
      return true
    }

    // 用户必须具有所有权限，才能访问
    for (const product of products) {
      if (!user.products.includes(product)) {
        return false
      }
    }

    return true;
  }
}
