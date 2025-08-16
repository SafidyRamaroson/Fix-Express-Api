import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuotesModule } from './quotes/quotes.module';
import { RepairsModule } from './repairs/repairs.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { PingController } from './ping/ping.controller';


@Module({
  imports: [QuotesModule, RepairsModule],
  controllers: [AppController, PingController],
  providers: [AppService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }

}
