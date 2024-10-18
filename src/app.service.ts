import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTotalValue(): number {
    return 100_000_000;
  }

  getTotalSupply(): number {
    return 50_000_00;
  }
}
