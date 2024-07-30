import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { comparePassword } from '@app/util';
import { ConfigService } from '@nestjs/config';

const matchMessage = (result, hash): Promise<boolean> => {
  return comparePassword(
    result[4] +
      result[1] +
      result[7] +
      result[8] +
      result[6] +
      result[2] +
      result[11] +
      result[5],
    hash,
  );
};

@Injectable()
export class CodeAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (this.configService.get('ENV') === 'dev') {
      return true;
    }
    if (!req.session.codeMessage) {
      return false;
    }
    return matchMessage(req.session.codeMessage, req.headers['message']);
  }
}
