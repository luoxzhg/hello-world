import { Injectable, BadRequestException, UnauthorizedException, HttpException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { SmsService } from '@fagougou/nest-sms';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { comparePassword, encodePublicKey } from '@app/util';
import STS from 'qcloud-cos-sts';
import { OkResponse } from '../common/interfaces/ok-response.interface';
import { UserService } from '../user/user.service';
import console, { time } from 'console';
import { CacheService } from '../common/db/redis-cache.service';
import dayjs from 'dayjs';
import { create } from 'domain';
import type { Wrapper } from 'src/common/wrapper.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: Wrapper<UserService>,
    private readonly redisService: CacheService,
    // private readonly smsService: SmsService,
    // @InjectModel('Verify') private readonly verifyModel: Model<any>,
    // @InjectModel('User') private readonly userModel: Model<any>,
    // @InjectModel('Code') private readonly activecodeModel: Model<any>,
    // @InjectModel('Record') private readonly recordModel: Model<any>
  ) { }


  /**
   * @description 校验用户密码
   */
  async validateUser(phone, password) {
    // 对前端密码解密
    password = await encodePublicKey(password)
    phone = await encodePublicKey(phone)
    if (!password) {
      throw new UnauthorizedException('不合法登录');
    }

    const user = await this.userService.getUserByMobile(phone);
    if (!user) {
      throw new UnauthorizedException('account fail');
    }

    const isValid = password === user.password || (await comparePassword(password, user.password));
    if (!isValid) {
      throw new UnauthorizedException('password fail');
    }

    return user
  }

  validateExpiryDate(expiryDate) {
    if (!(expiryDate instanceof Date)) {
      expiryDate = new Date(expiryDate)
    }

    if (Date.now() > expiryDate.getTime()) {
      throw new HttpException('账户授权过期', 41000);
    }
    return true
  }

  async signJwtByUser(user) {
    const jwtPayload : JwtPayload = this.userService.toPlainUser(user)
    const token = await this.signJwt(jwtPayload)

    //单一在线验证
    await this.redisService.set(
      this.genRedisKeyForJwtToken(user.id),
      token,
      60 * 60 * 24 * 30,
    );
    return {
      token,
      roles: jwtPayload.roles,
      products: jwtPayload.products
    }
  }

  // 单一在线验证：Redis key
  genRedisKeyForJwtToken(id: string): string {
    return `fagougou-products-center-user-token-${id}`;
  }

  async signJwt(payload) {
    const token = await this.jwtService.signAsync(payload)

    return token
  }

  /**
 * cookie登录
 */
  async cookieLogin(res, authInfo) {
    res.cookie('token', authInfo.token, {
      expires: authInfo.expires,
      httpOnly: true,
    });
    const payload: OkResponse = {
      code: 0,
      data: authInfo,
    };
    res.json(payload);
  }

  /**
   * 退出登录，释放资源
   */
  async logout(id: string) {
    await this.redisService.del(this.genRedisKeyForJwtToken(id))
  }

  // 获取上传文件凭证
  async getSTSToken() {
    return new Promise((resolve, reject) => {
      const policy = {
        version: '2.0',
        statement: [
          {
            action: [
              // 简单上传
              'name/cos:PutObject',
              'name/cos:PostObject',
              // 分片上传
              'name/cos:InitiateMultipartUpload',
              'name/cos:ListMultipartUploads',
              'name/cos:ListParts',
              'name/cos:UploadPart',
              'name/cos:CompleteMultipartUpload',
            ],
            effect: 'allow',
            principal: { qcs: ['*'] },
            resource: ['*'],
          },
        ],
      };
      const secretId = this.configService.get('COS_SECRET_ID');
      const secretKey = this.configService.get('COS_SECRET_KEY');
      STS.getCredential(
        {
          secretId,
          secretKey,
          policy: policy,
        },
        function (err: any, credential: any) {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(credential);
          }
        },
      );
    });
  }

  // 账号密码登录
  // async signin(phone, password) {
  //   try {
  // const user = await this.userSvc.getUserByMobile(phone);
  // const isValid = await comparePassword(password, user.password);
  // delete user.password;
  // if (!isValid) {
  //   throw new UnauthorizedException('password or account fail');
  // }
  //     const jwtData: JwtPayload = {
  //       id: user.id,
  //       telephone: user.telephone,
  //       roles: user.roles,
  //     };
  //     const token = this.jwtService.sign(jwtData);
  //     return {
  //       token,
  //       expires: new Date(Date.now() + this.configService.get('TOKEN_EXPIRES')),
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // 注册
  // async signup(body) {
  //   try {
  //     const { telephone, password } = body;
  //     const maybeUser = await this.userModel.findOne({ telephone });
  //     if (maybeUser) {
  //       throw new BadRequestException('user registered.');
  //     }
  //     const userData = {
  //       telephone,
  //       password,
  //     };
  //     try {
  //       const hash = await cryptPassword(userData.password);
  //       userData.password = hash;
  //     } catch (err) {
  //       throw new Error(err);
  //     }
  //     const user = await this.userModel.create(userData);
  //     const jwtData: JwtPayload = {
  //       id: user.id,
  //       telephone: user.telephone,
  //       roles: user.roles,
  //     };
  //     const token = this.jwtService.sign(jwtData);
  //     return { token };
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  // 发送验证码
  // async validateUserByPhone(
  //   telephone: string,
  //   ip: string,
  //   type: string,
  // ): Promise<any> {
  //   if (!telephone) throw new BadRequestException('缺少参数');
  //   const user = await this.userModel.findOne(
  //     { telephone, isDeleted: { $ne: true } },
  //     '-password',
  //   );

  //   if (type == 'register' && user) {
  //     throw new BadRequestException('用户已存在!请到登录页面登录');
  //   } else if (type == 'login' && !user) {
  //     throw new BadRequestException('用户不存在！请先注册');
  //   }
  //   try {
  //     // 6位 5分钟失效
  //     const code = Math.random()
  //       .toString()
  //       .slice(-6);
  //     const verify = {
  //       telephone: telephone,
  //       code: code,
  //       ip: ip,
  //     };

  //     const verifys = await this.verifyModel
  //       .find({ telephone: telephone })
  //       .sort({
  //         _id: -1,
  //       });

  //     if (
  //       (verifys && !verifys.length) ||
  //       new Date().getTime() - new Date(verifys[0].createdAt).getTime() > 60000
  //     ) {
  //       const options = {
  //         telephone: telephone,
  //         text: `验证码${code}，5分钟内有效，请妥善保管。【企法侠2.0】`,
  //       };
  //       await Promise.all([
  //         this.verifyModel.create(verify),
  //         //测试的时候关掉这个发送信息
  //         this.smsService.sendCode(options),
  //       ]);
  //       const hidden = this.configService.get('NODE_ENV') === 'production';
  //       if (!hidden) {
  //         return code;
  //       }
  //     } else {
  //       return { mg: '一分钟内不要重复请求', time: 60000 - (new Date().getTime() - new Date(verifys[0].createdAt).getTime()) }
  //     }
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }
  // }

  // /**
  //  * 验证验证码
  //  */
  // // async checkCode(telephone: string, code: string) {
  // //   try {
  // //     const verify = await this.verifyModel
  // //       .find({ telephone: telephone })
  // //       .sort({ _id: -1 })
  // //       .limit(1);
  // //     const currentVerify = verify && verify[0];
  // //     if (!currentVerify) throw new Error('验证码错误');
  // //     if (!currentVerify.nums) throw new Error('验证码已失效，请重新获取。'); // 5次机会，5次都验证失败，当前验证码失效

  // //     const isCorrectCode =
  // //       !currentVerify.isCheck &&
  // //       currentVerify.code === code &&
  // //       new Date().getTime() - new Date(currentVerify.createdAt).getTime() <
  // //       60000 * 5; // 5分钟内有效

  // //     if (!isCorrectCode) {
  // //       if (!currentVerify.isCheck) {
  // //         // 没有被验证过，才减有效次数
  // //         await this.verifyModel.findOneAndUpdate(
  // //           { _id: currentVerify._id },
  // //           { $set: { nums: currentVerify.nums - 1 } },
  // //         );
  // //       }
  // //       throw new Error('验证码错误');
  // //     }
  // //     return currentVerify;
  // //   } catch (err) {
  // //     throw new BadRequestException(err.message);
  // //   }
  // // }

  // async login(telephone: string, code: string, openid?: string) {
  //   try {
  //     const currentVerify = await this.checkCode(telephone, code);
  //     let [customer] = await Promise.all([
  //       this.userModel.findOne(
  //         { telephone, isDeleted: { $ne: true } },
  //         '-password',
  //       ),
  //       this.verifyModel.findOneAndUpdate(
  //         { _id: currentVerify._id },
  //         { $set: { isCheck: true } },
  //       ),
  //     ]);

  //     if (!customer) {
  //       throw new Error('用户不存在 请先注册账号');
  //     } else {
  //       // const result = await this.redis.get(`sess:${telephone}/*`);
  //       // if (result) {
  //       //   this.redis.del(result[0]);
  //       // }
  //       const action = `${customer.telephone}` + `登陆了系统`;
  //       // this.userService.createReord('账户设置', customer._id, action);

  //       return this.sign(customer);
  //     }
  //     /**
  //       if (!customer) {
  //         // 是否存在此微信用户
  //         const wxUser = await this.userModel.findOne({'wx.openid': openid}, '-password')
  //         if (wxUser) {
  //           customer = await this.userModel.updateOne({_id: wxUser._id}, {telephone}).select('-password')
  //         } else {
  //           // 创建一个用户
  //           const customerModel = await this.userModel.create({telephone, 'wx.openid': openid})
  //           customer = customerModel
  //           throw new Error("用户不存在 请先注册账号");

  //         }
  //       } else if(customer.wx && !customer.wx.openid) {
  //         await this.userModel.updateOne({_id: customer._id}, {'wx.openid': openid})
  //       }
  //       return this.sign(customer)
  //        */
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async login2(openid: string) {
  //   try {
  //     let user = await this.userModel.findOne({ 'wx.openid': openid });
  //     if (!user) {
  //       user = await this.userModel.create({
  //         'wx.nickname': '招商银行用户',
  //         'wx.openid': openid,
  //       });
  //     }
  //     await user.save();
  //     return user;
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async login3(openid: string, telephone?: string) {
  //   try {
  //       let customer = await this.userModel.findOne({telephone})

  //       if (!customer) {
  //         // 是否存在此微信用户
  //         const wxUser = await this.userModel.findOne({'wx.openid': openid})
  //         if (wxUser) {
  //           customer = await this.userModel.updateOne({_id: wxUser._id}, {telephone})
  //         } else {
  //           // 创建一个用户
  //           const customerModel = await this.userModel.create({telephone, 'wx.openid': openid, nickname: '招商银行用户'})
  //           customer = customerModel
  //         }
  //       } else if(customer.wx && !customer.wx.openid) {
  //         await this.userModel.updateOne({_id: customer._id}, {'wx.openid': openid})
  //       }
  //       return this.sign(customer)
  //   } catch (error) {
  //       throw new BadRequestException(error.message)
  //   }
  // }

  // async sign(user) {
  //   const jwtPayload = {
  //     id: user.id,
  //     telephone: user.telephone,
  //     roles: user.roles,
  //   };
  //   const token = this.jwtService.sign(jwtPayload);
  //   await this.redisService.set(
  //     `qifaxia2-user-token-${user.id}`,
  //     token,
  //     60 * 60 * 24 * 30,
  //   );
  //   return {
  //     token,
  //     expires: new Date(
  //       Date.now() + Number(this.configService.get('TOKEN_EXPIRES')),
  //     ),
  //   };
  // }

  async wxsign(user) {
    const jwtPayload = {
      id: user.id,
      telephone: user.telephone,
      roles: user.roles,
    };
    const token = this.jwtService.sign(jwtPayload);
    await this.redisService.set(
      `qifaxia2-user-token-${user.id}`,
      token,
      60 * 1000 * 60 * 24 * 30,
    );
    return {
      token,
      expires: new Date(
        Date.now() + Number(this.configService.get('TOKEN_EXPIRES')),
      ),
      openid: user.openid,
    };
  }

  // sign2(user) {
  //   const jwtPayload = {
  //     id: user.id,
  //     openid: user.wx.openid,
  //     roles: user.roles,
  //   };
  //   const token = this.jwtService.sign(jwtPayload);
  //   return {
  //     token,
  //     expires: new Date(Date.now() + this.configService.get('TOKEN_EXPIRES')),
  //   };
  // }

  // 浏览器真人验证机制
  /**
   * 生成一个随机字符串，用于发送验证码之前的检验
   * 步骤：
   * 1、获取随机字符串，base64编码之后发送给前端
   * 2、前端获取到字符之后，base64解码，按顺序将下标为 4 1 7 8 6 2 11 5 的字符拼接成新的字符串B
   * 3、将字符串B使用bcrypt（10 Salt,hash）加密，得到密文A
   * 4、请求验证码的时候，将密文A加到请求头中，属性为message
   * 5、之后codeAuth中间件会进行验证
   */
  // async validateClient(req) {
  //   const codeMessage = this.generateString();
  //   req.session.codeMessage = codeMessage;
  //   return Buffer.from(codeMessage).toString('base64');
  // }

  // private generateString(length = 16) {
  //   const chars =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()~+_';
  //   let nonceStr = '';
  //   const maxPos = chars.length;

  //   for (let i = 0; i < length; i++) {
  //     nonceStr += chars[Math.floor(Math.random() * maxPos)];
  //   }

  //   return nonceStr;
  // }

  /**
   * 减去使用次数
   * @param body
   * @returns
   */
  // async cut(body, req) {
  //   const { type } = body;
  //   const userId = req.user.id;
  //   const result = await this.userModel.findById(userId);
  //   const time = result.endAt;
  //   console.log(time);
  //   let data;

  //   if (time > Date.now()) {
  //     data = await this.userModel.findById(userId);
  //   } else if (!time || time < Date.now()) {
  //     if (type == 'create') {
  //       if (result.create <= 0) {
  //         throw new BadRequestException(
  //           '非常抱歉,您的“合同起草/智能审核”体验次数已经用完。您可联系我们的客服人员购买正式会员',
  //         );
  //       }
  //       data = await this.userModel.findByIdAndUpdate(
  //         { _id: userId },
  //         { $set: { create: result.create - 1 } },
  //         { new: true },
  //       );
  //     } else if (type == 'verify') {
  //       if (result.verify <= 0) {
  //         throw new BadRequestException(
  //           '非常抱歉,您的“合同起草/智能审核”体验次数已经用完。您可联系我们的客服人员购买正式会员',
  //         );
  //       }
  //       data = await this.userModel.findByIdAndUpdate(
  //         { _id: userId },
  //         { $set: { verify: result.verify - 1 } },
  //         { new: true },
  //       );
  //     }
  //   } else {
  //     throw new BadRequestException('用户会员已到期');
  //   }
  //   return data
  // }

  // 注册
  // async register(body) {
  //   try {
  //     const { telephone, companyname, profession, amount, code, openid } = body;
  //     const maybeUser = await this.userModel.findOne(
  //       { telephone, isDeleted: { $ne: true } },
  //       '-password',
  //     );
  //     if (maybeUser) {
  //       throw new BadRequestException('用户已注册!');
  //     }
  //     const userData = {
  //       telephone,
  //       companyname,
  //       profession,
  //       amount,
  //       openid,
  //     };
  //     let [user, currentVerify] = await Promise.all([
  //       this.userModel.create(userData),
  //       this.checkCode(telephone, code),
  //     ]);
  //     // const user = await this.userModel.create(userData);
  //     // const currentVerify = await this.checkCode(telephone, code);
  //     await this.verifyModel.findOneAndUpdate(
  //       { _id: currentVerify._id },
  //       { $set: { isCheck: true } },
  //     );
  //     const action = `${user.telephone}` + `登陆了系统`;
  //     const recordData = {
  //       type: '账户设置',
  //       userId: user._id,
  //       action,
  //     };
  //     await this.recordModel.create(recordData);

  //     return this.sign(user);
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  /**
   * 激活码激活
   * @param body
   * @param req
   * @returns
   */
  // async activatecode(body, req) {
  //   try {
  //     const { activecode } = body;
  //     const result = await this.activecodeModel.findOne({
  //       activecode: activecode,
  //     });
  //     if (!result) {
  //       throw new Error('该激活码不存在');
  //     } else if (result && result.isCheck == true) {
  //       throw new Error('该激活码已经被使用');
  //     } else {
  //       const { id } = req.user;
  //       const { telephone } = req.user;

  //       await this.activecodeModel.findOneAndUpdate(
  //         { activecode: activecode },
  //         { $set: { isCheck: true } },
  //       );

  //       let user;

  //       if (result.codetype == 'year') {
  //         const demo = await this.userModel.findById(id);
  //         let endAt;

  //         if (
  //           !demo.endAt ||
  //           (demo.endAt && demo.endAt < new Date(Date.now()))
  //         ) {
  //           endAt = dayjs(new Date(Date.now())).add(365, 'd');
  //         } else {
  //           endAt = dayjs(demo.endAt).add(365, 'd');
  //         }
  //         const endtime = dayjs(endAt).format('YYYY-MM-DD');
  //         const action =
  //           `${req.user.telephone}` +
  //           `使用激活码兑换了一年会员特权，会员有效期到` +
  //           `${endtime}`;

  //         // this.userService.createReord('账户设置', req.user.id, action);

  //         user = await this.userModel.findOneAndUpdate(
  //           { _id: id },
  //           { $set: { endAt: endAt, verify: 0, create: 0 } },
  //           { new: true },
  //         );
  //       } else {
  //         const action = `${req.user.telephone}` + `使用激活码兑换了体验特权`;

  //         // this.userService.createReord('账户设置', req.user.id, action);
  //         const result = await this.userModel.findById(id);
  //         user = await this.userModel.findOneAndUpdate(
  //           { _id: id },
  //           { $set: { verify: result.verify + 3, create: result.create + 3 } },
  //           { new: true },
  //         );
  //       }
  //       return { user };
  //     }
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  /**
   * 生成激活码
   * @param type
   * @returns
   */
  // async getCode(type) {
  //   const code = Math.random()
  //     .toString()
  //     .slice(-13);

  //   let activecode;

  //   if (type == 'year') {
  //     activecode = {
  //       activecode: code,
  //     };
  //   } else {
  //     activecode = {
  //       activecode: code,
  //       codetype: 'times',
  //     };
  //   }

  //   try {
  //     const result = await this.activecodeModel.create(activecode);
  //     return { result };
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }



  /**
   * 企业微信登录
   */
  // async qwxLogin(info) {
  //   const user = await this.userService.updateOrCreateQwxUser(info);
  //   return this.sign(user);
  // }

  /**
   * 微信登录
   */
  // async wxLogin(info) {
  //   let user = await this.userModel.findOne({
  //     $or: [{ 'wx.openid': info.openid }],
  //   });
  //   if (!user) {
  //     const newUser = {
  //       avatar: info.headimgurl,
  //       roles: ['user'],
  //       wx: info,
  //     };
  //     user = await this.userModel.create(newUser);
  //   } else {
  //     await this.userModel.updateOne({ _id: user._id }, { wx: info });
  //   }
  //   return this.sign(user);
  // }

}
