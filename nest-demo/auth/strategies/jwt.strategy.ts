import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-jwt';

import type { Request, Response } from 'express';
import { CacheService } from 'src/common/db/redis-cache.service';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private redisService: CacheService,
    private readonly authSvc: AuthService
  ) {
    super({
      jwtFromRequest: req => {
        let token = req.cookies && req.cookies['token'];

        if (!token && req.headers) {
          token = req.headers['authorization']?.split(' ')[1] || req.headers['inner-token'];
          }

        //单一在线验证
        req.res.locals.token = token
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('MONGO_PASSWORD'),
      passReqToCallback: true,
    } as StrategyOptions);
  }

  /**
   * 设备验证
   * @param req
   * @param payload
   * @returns
   */
  async validate(req: Request, payload: JwtPayload) {
    // console.log(payload);
    // 校验账户授权是否到期
    this.authSvc.validateExpiryDate(new Date(payload.expiryDate))

    //单一在线验证
    const token = req.res.locals.token
    // console.log(token);
    const cacheToken = await this.redisService.get(this.authSvc.genRedisKeyForJwtToken(payload.id));

    if (!cacheToken) {
      throw new UnauthorizedException('您的登录状态已失效，请重新登录');
    }

    if (token !== JSON.parse(cacheToken)) {
      // res.clearCookie('token', { httpOnly: true });
      throw new UnauthorizedException('您账户已经在另一处登录，请重新登录');
    }

    return payload;
  }
}
