import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { SmsService } from '@fagougou/nest-sms';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifySchema } from './verify.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSchema } from '../user/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ActiveCodeSchema } from 'src/user/schemas/activecode.schema';
import { RecordSchema } from 'src/user/schemas/record.schema';
import { CacheService } from '../common/db/redis-cache.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthingJwtStrategy } from './strategies/authing.strategy';
import { FaXiaoKaiJwtStrategy } from './strategies/fa-xiao-kai.strategy';

@Global()
@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,//.register({ defaultStrategy: ['local', 'jwt'] }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('MONGO_PASSWORD'),
        signOptions: {
          expiresIn: Number(config.get('TOKEN_EXPIRES'))
        }
      })
    })
    // MongooseModule.forFeature([
    //   // { name: 'Verify', schema: VerifySchema },
    //   // { name: 'User', schema: UserSchema },
    //   // { name: 'Code', schema: ActiveCodeSchema },
    //   // { name: 'Record', schema: RecordSchema },
    // ]),
  ],
  providers: [
    CacheService,
    LocalStrategy,
    JwtStrategy,
    AuthingJwtStrategy,
    FaXiaoKaiJwtStrategy,
    AuthService,
    // {
    //   provide: JwtService,
    //   useFactory: (configService: ConfigService) =>
    //     new JwtService({
    //       secret: configService.get('MONGO_PASSWORD'),
    //       signOptions: {
    //         expiresIn: Number(configService.get('TOKEN_EXPIRES')),
    //       },
    //     }),
    //   inject: [ConfigService],
    // },
    // {
    //   provide: SmsService,
    //   useFactory: (configService: ConfigService) =>
    //     new SmsService(configService.get('MESSAGE_SERVICE_URL')),
    //   inject: [ConfigService],
    // }
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
