import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodArray, ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
   constructor(private schema: ZodObject<any> | ZodArray<any>) { }

   transform(value: unknown, metadata: ArgumentMetadata) {
      try {
         return this.schema.parse(value);
      } catch (error) {
         throw new BadRequestException(`Validation failed: ${error.message}`);
      }
   }
}
