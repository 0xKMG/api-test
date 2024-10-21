import { Connection, PublicKey, TokenAmount } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Wallet,
  loadKeypair,
  DriftClient,
  FastSingleTxSender,
  convertToNumber,
  QUOTE_PRECISION,
  User,
} from '@drift-labs/sdk';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  {
    httpAgent: false,
  },
);

const stateCommitment = 'confirmed';
const fatherAddress = new PublicKey(
  'C97KWda7WSW9hs65PXEUxWSpNx2TPQH86Dk7QsscFgYD',
);

async function initializeDriftClient(): Promise<DriftClient> {
  const delegateWallet = new Wallet(
    loadKeypair(process.env.DELEGATE_PRIVATE_KEY || ''),
  );
  const driftClient = new DriftClient({
    connection,
    wallet: delegateWallet,
    env: 'mainnet-beta',
    opts: {
      commitment: stateCommitment,
      skipPreflight: false,
      preflightCommitment: stateCommitment,
    },
    authority: fatherAddress,
    activeSubAccountId: 0,
    subAccountIds: [0],
    txSender: new FastSingleTxSender({
      connection,
      wallet: delegateWallet,
      opts: {
        commitment: stateCommitment,
        skipPreflight: false,
        preflightCommitment: stateCommitment,
      },
      timeout: 3000,
      blockhashRefreshInterval: 1000,
    }),
  });

  await driftClient.subscribe();
  return driftClient;
}

function calculateAccountValueUsd(user: User): number {
  const netSpotValue = convertToNumber(
    user.getNetSpotMarketValue(),
    QUOTE_PRECISION,
  );
  const unrealizedPnl = convertToNumber(
    user.getUnrealizedPNL(true, undefined, undefined),
    QUOTE_PRECISION,
  );
  return netSpotValue + unrealizedPnl;
}

async function getCurrentAccountValue(): Promise<number> {
  const driftClient = await initializeDriftClient();
  const user = driftClient.getUser();
  const currentAccountValue = calculateAccountValueUsd(user);
  await driftClient.unsubscribe();
  return currentAccountValue;
}

async function fetchTotalSupply(
  connection: Connection,
  mintAddress: string,
): Promise<string | undefined> {
  const mintPublicKey = new PublicKey(mintAddress);
  const tokenSupply = await connection.getTokenSupply(mintPublicKey);

  return tokenSupply.value.uiAmountString;
}

async function main() {
  try {
    const accountValue = await getCurrentAccountValue();
    console.log('Current Account Value:', accountValue);

    const tokenMintAddress = '2tA2AW8LeDwZZjNx7WudWABbZXrNMdkDbr2GXuPDHBRu';
    const totalSupply = await fetchTotalSupply(connection, tokenMintAddress);
    console.log('Total Supply:', totalSupply);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

export {
  initializeDriftClient,
  calculateAccountValueUsd,
  getCurrentAccountValue,
  fetchTotalSupply,
};
