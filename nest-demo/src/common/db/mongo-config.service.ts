import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    const config = {
      host: this.configService.get('MONGO_HOST'),
      port: this.configService.get('MONGO_PORT'),
      dbname: this.configService.get('MONGO_DBNAME'),
      username: this.configService.get('MONGO_USER'),
      password: encodeURIComponent(this.configService.get('MONGO_PASSWORD')),
    };
    let uri = `mongodb://localhost:${config.port}/${config.dbname}`;
    if (config.username) {
      uri = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.dbname}`;
    }
    return {
      uri,
      // useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      // native_parser: true,
      // poolSize: 5,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      authSource: 'admin',
      replicaSet: process.env.MONGO_RS,
      directConnection: process.env.ENV=='dev'? true : false,
    };
  }
}
