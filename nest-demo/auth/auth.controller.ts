import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { getPublicKey } from '@app/util';

@Controller('auth')
export class AuthController {
  constructor(
    // private readonly configSvc: ConfigService,
    // private readonly jwtSvc: JwtService,
    private readonly authSvc: AuthService,
    ) {}


  @Post('/token')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req) {
    const user = req.user
    return user
    // * 签署 JWT
    // return await this.authSvc.signJwtByUser(user)
  }

  // @Get('getPublicKey')
  // async getPublicKey(){
  //   return await getPublicKey('publicKey', false)
  // }
}
