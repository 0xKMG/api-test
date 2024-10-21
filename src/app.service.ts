import { Injectable } from '@nestjs/common';
import { getCurrentAccountValue, fetchTotalSupply } from './drift';
import { Connection } from '@solana/web3.js';

@Injectable()
export class AppService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    );
  }
  async getTotalValue(): Promise<string> {
    try {
      const accountValue = await getCurrentAccountValue();
      return accountValue.toString();
    } catch (error) {
      console.error('Error getting total value:', error);
      return 'Error fetching total value';
    }
  }

  async getTotalSupply(): Promise<string> {
    try {
      const tokenMintAddress = '2tA2AW8LeDwZZjNx7WudWABbZXrNMdkDbr2GXuPDHBRu';
      const totalSupply = await fetchTotalSupply(
        this.connection,
        tokenMintAddress,
      );
      return totalSupply || 'N/A';
    } catch (error) {
      console.error('Error getting total supply:', error);
      return 'Error fetching total supply';
    }
  }
}
