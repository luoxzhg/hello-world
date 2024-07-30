import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/role-auth.guard';
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard(['authing', 'FaXiaoKai', 'jwt']), RolesGuard),
    // UseGuards(AuthGuard(['authing']), RolesGuard),
  );
}
