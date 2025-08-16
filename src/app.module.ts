import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuotesModule } from './quotes/quotes.module';
import { RepairsModule } from './repairs/repairs.module';

@Module({
  imports: [QuotesModule, RepairsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
