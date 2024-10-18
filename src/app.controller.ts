import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('totalvalue')
  getTotalValue(): number {
    return this.appService.getTotalValue();
  }

  @Get('totalsupply')
  getTotalSupply(): number {
    return this.appService.getTotalSupply();
  }
}