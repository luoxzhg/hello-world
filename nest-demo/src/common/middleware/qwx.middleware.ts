import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';
import bodyParser from 'body-parser';
import bodyParserXML from 'body-parser-xml';

@Injectable()
export class QwxMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    bodyParserXML(bodyParser);
    bodyParser['xml']()(req, res, next);
  }
}
