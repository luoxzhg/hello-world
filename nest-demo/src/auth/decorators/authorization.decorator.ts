/*
 * @Author: VLOU
 */
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../guards/authorization-auth.guard';

export const Authorization = () => applyDecorators(UseGuards(AuthorizationGuard));
