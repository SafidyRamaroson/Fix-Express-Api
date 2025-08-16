import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DateFormatter } from 'src/utils/dateFormatter.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const now = new Date();

    const formattedDate = DateFormatter.format(now);

    console.log(`[${formattedDate}] ${req.method} ${req.originalUrl}`);

    next();
  }
}
