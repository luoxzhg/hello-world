/*
 * @Author: VLOU
 */
import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    const token = this.configService.get('AUDIT_AUTHORIZATION')
    const author = req.headers.authorization
    const source = req.headers.source

    console.log('auth-headers--', [source, author, token])

    // 免鉴权的渠道
    const channel = this.configService.get('AUTHORIZATION_CHANNEL')
    if(channel) {
      const channelArr = channel.split(',')
      if(channelArr.includes(source)) {
        return true
      }
    }

    if (!author || token !== author) {
      throw new HttpException('无权限', 40003)
    }
    return true
  }
}
