import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authSvc: AuthService) {
    super({ usernameField: 'phone' })
  }


  async validate(phone: string, password: string) {
    const user = await this.authSvc.validateUser(phone, password)

    this.authSvc.validateExpiryDate(user.expiryDate)
    return user
  }
}