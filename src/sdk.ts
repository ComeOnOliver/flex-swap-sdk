// import { RpcModule } from "./modules/rpcModule";
import {
  Account,
  Aptos,
  AptosConfig,
  AptosSettings,
  Ed25519PrivateKey,
  MoveStructId,
  Network,
} from '@aptos-labs/ts-sdk';

import {
  INTERNAL_INDEXER,
  INTERNAL_INDEXER_URL,
  PACKAGE_ID,
  TESTNET_FAUCET,
  TESTNET_FULLNODE,
  TESTNET_INDEXER,
} from './config';
import { CoinModule } from './modules/coinModule';
import { FAModule } from './modules/FAModule';
import { MixPoolModule } from './modules/mixPoolModule';
import { PoolModule } from './modules/poolModule';

export class FlexSDK {
  public account: Account;
  public poolModule: PoolModule;
  public faModule: FAModule;
  public mixPoolModule: MixPoolModule;
  public coinModule: CoinModule;
  protected senderAddress = '';
  public aptosClient: Aptos;
  protected privateKeyHex;

  constructor(
    settings: AptosSettings = {
      network: Network.CUSTOM,
      fullnode: TESTNET_FULLNODE,
      indexer: TESTNET_INDEXER,
      faucet: TESTNET_FAUCET,
    },
    privateKey?: string
  ) {
    if (!privateKey) {
      this.privateKeyHex = Account.generate().privateKey.toStringWithoutPrefix();
      console.log(`New private key generated: ${this.privateKeyHex}`);
    } else {
      this.privateKeyHex = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    }
    const ed25519Key = new Ed25519PrivateKey(this.privateKeyHex.slice(0, 64));
    // Use asynchronous initialization to ensure account is ready after construction
    this.account = Account.fromPrivateKey({ privateKey: ed25519Key });
    this.senderAddress = this.account.accountAddress.toString();

    const aptosConfig = new AptosConfig({
      network: settings.network || Network.CUSTOM,
      fullnode: settings.fullnode || TESTNET_FULLNODE,
      indexer: settings.indexer || TESTNET_INDEXER,
      faucet: settings.faucet || TESTNET_FAUCET,
    });
    this.aptosClient = new Aptos(aptosConfig);
    this.poolModule = new PoolModule(this.aptosClient, this.senderAddress);
    this.faModule = new FAModule(this.aptosClient, this.senderAddress);
    this.coinModule = new CoinModule(this.aptosClient, this.senderAddress);
    this.mixPoolModule = new MixPoolModule(this.aptosClient, this.senderAddress);
  }

  get address(): string {
    return this.senderAddress;
  }

  set updateSenderAddress(value: string) {
    this.senderAddress = value;
  }

  async fetchAccountCoins(accountAddress: string = this.senderAddress) {
    return await this.aptosClient.getAccountCoinsData({ accountAddress });
  }

  async fetchAccountCoinAmount(
    accountAddress: string = this.senderAddress,
    coinType: MoveStructId
  ) {
    return await this.aptosClient.getAccountCoinAmount({ accountAddress, coinType });
  }

  get getPackageId() {
    return PACKAGE_ID;
  }

  //check x less than y
  async checkXLessThanY(x: string, y: string) {
    return await this.aptosClient.view({
      payload: this.poolModule.checkXLessThanYData(x, y),
    });
  }

  async checkAddressXLessThanY(x: string, y: string) {
    return await this.aptosClient.view({
      payload: this.poolModule.checkAddressXLessThanYData(x, y),
    });
  }

  async getSwapYPrice(
    poolId: string,
    amount: number,
    a2b: boolean,
    minimumYAmount: number,
    poolType: 'coin' | 'mix' | 'fa'
  ) {
    const moduleMap = {
      coin: this.coinModule,
      mix: this.mixPoolModule,
      fa: this.faModule,
    } as const;

    const selectedModule = moduleMap[poolType];
    if (selectedModule) {
      const payload = await selectedModule.getSwapYPriceData(poolId, amount, a2b, minimumYAmount);
      return await this.aptosClient.view({ payload });
    }
    throw new Error(`Unsupported pool type: ${poolType}`);
  }

  async getPoolMetaData(poolId: string) {
    return await this.aptosClient.getAccountResources({
      accountAddress: poolId,
    });
  }

  async getPoolInfoByTokens(tokenA: string, tokenB: string) {
    const isTokenAV1 = tokenA.includes('::');
    const isTokenBV1 = tokenB.includes('::');
    let x = tokenA,
      y = tokenB;

    if (!isTokenAV1 && !isTokenBV1) {
      // Both tokens are v2
      const isXLessThanY = await this.checkAddressXLessThanY(tokenA, tokenB);
      const result = isXLessThanY[0];
      if (!result) {
        x = tokenB;
        y = tokenA;
      }
    } else if (isTokenAV1 && isTokenBV1) {
      // Both tokens are v1
      const isXLessThanY = await this.checkXLessThanY(tokenA, tokenB);
      const result = isXLessThanY[0];
      if (!result) {
        x = tokenB;
        y = tokenA;
      }
    } else {
      // One token is v1, the other is v2
      if (isTokenAV1) {
        x = tokenB;
        y = tokenA;
      }
    }
    const fetchUrl = `${INTERNAL_INDEXER}/distinct/byTokenTypes?xTokenType=${x}&yTokenType=${y}`;
    const response = await fetch(fetchUrl);
    const data = await response.json();
    return data;
  }

  async getPoolIdBasedOnLiquidityToken(liquidityTokenId: string) {
    const fetchUrl = `${INTERNAL_INDEXER_URL}/accounts/${liquidityTokenId}/resource/0x1::object::ObjectCore`;

    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const data = await response.json();
    const poolId = data.data.owner;

    return poolId;
  }
}
