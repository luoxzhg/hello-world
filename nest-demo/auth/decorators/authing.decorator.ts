import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function Authing() {
   return applyDecorators(
      UseGuards(AuthGuard('authing')),
   );
}
