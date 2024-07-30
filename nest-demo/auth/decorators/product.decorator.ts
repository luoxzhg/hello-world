import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ProductAuthGuard } from '../guards/product-auth.guard';

export const Product = (...products: string[]) => applyDecorators(
  SetMetadata('products', products),
  UseGuards(AuthGuard(['authing', 'FaXiaoKai', 'jwt']), ProductAuthGuard)
  // UseGuards(AuthGuard(['jwt']), ProductAuthGuard)
)
