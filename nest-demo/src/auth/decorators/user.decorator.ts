
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from '../interfaces/user.interface';

export const User = createParamDecorator((data: string, ctx: ExecutionContext): UserInfo => {
   const request = ctx.switchToHttp().getRequest();
   const user = request.user;
   // console.log('user info =>', user)
   return data ? user?.[data] : user;
});
