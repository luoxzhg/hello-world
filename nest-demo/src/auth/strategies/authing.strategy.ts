import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { CacheService } from "src/common/db/redis-cache.service";
import productConstants from "src/product/constants/product.constants";
import { UserService } from "src/user/user.service";


@Injectable()
export class AuthingJwtStrategy extends PassportStrategy(Strategy, 'authing') {
   constructor(
      private readonly configSvc: ConfigService,
      private readonly userSvc: UserService,
      private redisService: CacheService,
   ) {
      super({
         secretOrKey: configSvc.get('AUTHING_APP_SECRET'),
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         issuer: configSvc.get('AUTHING_ISSUER'),
         audience: configSvc.get('AUTHING_APP_ID'),
         // passReqToCallback: true,
      } as StrategyOptions)
   }

   async validate(payload) {
      const userId = payload.sub
      const redisKey = `Compare2C:authing:id:${userId}`
      const cachedPayload = JSON.parse(await this.redisService.get(redisKey))
      // 如果有缓存且 payload 比缓存的旧，则无效
      if (cachedPayload && payload.iat < cachedPayload.iat) {
         return false
      }

      // 如果没有缓存，或 payload 比缓存新，则更新缓存
      if (!cachedPayload || payload.iat > cachedPayload.iat) {
         await this.redisService.set(redisKey, payload, payload.exp - Math.floor(Date.now() / 1000))
      }

      const user = await this.userSvc.getAuthingUserInfo(userId)
      ;(user as any).products = Object.values(productConstants)
      ;(user as any).roles = ['user']
      return user
   }
}
