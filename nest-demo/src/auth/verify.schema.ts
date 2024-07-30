import { Schema } from 'mongoose';

export const VerifySchema = new Schema(
  {
    telephone: String,
    code: String,
    ip: String,
    isCheck: { type: Boolean, default: false },
    nums: { type: Number, default: 5 }, // 5次有效，失败5次则验证码作废
  },
  {
    strict: false,
    timestamps: true,
  },
);
