import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get('totalvalue')
  async getTotalValue(): Promise<string> {
    return await this.appService.getTotalValue();
  }

  @Get('totalsupply')
  async getTotalSupply(): Promise<string> {
    return await this.appService.getTotalSupply();
  }
}
