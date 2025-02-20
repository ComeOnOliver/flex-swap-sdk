import { Aptos, InputGenerateTransactionPayloadData, MoveFunctionId } from '@aptos-labs/ts-sdk';

import { SDKConfig } from '../config';

import { PoolModule } from './poolModule';

export class CoinModule extends PoolModule {
  constructor(client: Aptos, senderAddress: string, sdkConfig: SDKConfig) {
    super(client, senderAddress, sdkConfig);
  }

  registerCoinData(coinType: string) {
    const data = {
      function: `0x1::managed_coin::register` as MoveFunctionId,
      functionArguments: [],
      typeArguments: [coinType],
    } as InputGenerateTransactionPayloadData;
    return data;
  }

  async registerCoin(client: Aptos, user: string, coinType: string) {
    const transaction = await client.transaction.build.simple({
      sender: user,
      data: this.registerCoinData(coinType),
    });
    return transaction;
  }

  async createPoolData(
    coinA: string,
    coinB: string,
    xAmount: number,
    yAmount: number,
    fee_numerator: number,
    fee_denominator: number
  ) {
    //check x less than y
    const xLessThanY = await this.client.view({
      payload: this.checkXLessThanYData(coinA, coinB),
    });
    if (xLessThanY[0] == false) {
      [coinA, coinB] = [coinB, coinA];
      [xAmount, yAmount] = [yAmount, xAmount];
    }

    const data = {
      function:
        `${this.config.PACKAGE_ID}::coin_pair_service::initialize_liquidity` as MoveFunctionId,
      functionArguments: [xAmount, yAmount, fee_numerator, fee_denominator],
      typeArguments: [coinA, coinB],
    } as InputGenerateTransactionPayloadData;
    return data;
  }

  async createCoinPool(
    client: Aptos,
    user: string,
    coinA: string,
    coinB: string,
    xAmount: number,
    yAmount: number,
    fee_numerator: number,
    fee_denominator: number
  ) {
    const transaction = await client.transaction.build.simple({
      sender: user,
      data: await this.createPoolData(
        coinA,
        coinB,
        xAmount,
        yAmount,
        fee_numerator,
        fee_denominator
      ),
    });
    return transaction;
  }

  async swapCoinData(poolId: string, a2b: boolean, amount: number, minimumYAmount: number) {
    const poolInfo = await this.getPoolInfo(poolId);
    const coinA = poolInfo.x_TokenType;
    const coinB = poolInfo.y_TokenType;

    if (a2b) {
      const data = {
        function: `${this.config.PACKAGE_ID}::coin_pair_service::swap_x` as MoveFunctionId,
        functionArguments: [poolId, amount, minimumYAmount],
        typeArguments: [coinA, coinB],
      } as InputGenerateTransactionPayloadData;
      return data;
    } else {
      const data = {
        function: `${this.config.PACKAGE_ID}::coin_pair_service::swap_y` as MoveFunctionId,
        functionArguments: [poolId, amount, minimumYAmount],
        typeArguments: [coinA, coinB],
      } as InputGenerateTransactionPayloadData;
      return data;
    }
  }

  async swapCoin(
    client: Aptos,
    user: string,
    poolId: string,
    a2b: boolean,
    amount: number,
    minimumYAmount: number
  ) {
    const transaction = await client.transaction.build.simple({
      sender: user,
      data: await this.swapCoinData(poolId, a2b, amount, minimumYAmount),
    });
    return transaction;
  }

  async addLiquidityData({
    poolId,
    xAmount,
    yAmount,
    tokenXType,
    tokenYType,
  }: {
    poolId: string;
    xAmount: number;
    yAmount: number;
    tokenXType?: string;
    tokenYType?: string;
  }) {
    let poolInfo;
    if (!tokenXType && !tokenYType) {
      poolInfo = await this.getPoolInfo(poolId);
    }

    const coinA = tokenXType || poolInfo.x_TokenType;
    const coinB = tokenYType || poolInfo.y_TokenType;

    const data = {
      function: `${this.config.PACKAGE_ID}::coin_pair_service::add_liquidity` as MoveFunctionId,
      functionArguments: [poolId, xAmount, yAmount, []],
      typeArguments: [coinA, coinB],
    } as InputGenerateTransactionPayloadData;
    return data;
  }

  async addLiquidity(
    client: Aptos,
    user: string,
    poolId: string,
    xAmount: number,
    yAmount: number
  ) {
    const transaction = await client.transaction.build.simple({
      sender: user,
      data: await this.addLiquidityData({ poolId, xAmount, yAmount }),
    });
    return transaction;
  }

  async removeLiquidityData({
    poolId,
    liquidityAmount,
    tokenXType,
    tokenYType,
  }: {
    poolId: string;
    liquidityAmount: number;
    tokenXType?: string;
    tokenYType?: string;
  }) {
    let poolInfo;
    if (!tokenXType && !tokenYType) {
      poolInfo = await this.getPoolInfo(poolId);
    }

    const coinA = tokenXType || poolInfo.x_TokenType;
    const coinB = tokenYType || poolInfo.y_TokenType;

    const data = {
      function: `${this.config.PACKAGE_ID}::coin_pair_service::remove_liquidity` as MoveFunctionId,
      functionArguments: [poolId, liquidityAmount, [], []],
      typeArguments: [coinA, coinB],
    } as InputGenerateTransactionPayloadData;
    return data;
  }

  async removeLiquidity(client: Aptos, user: string, poolId: string, liquidityAmount: number) {
    const transaction = await client.transaction.build.simple({
      sender: user,
      data: await this.removeLiquidityData({ poolId, liquidityAmount }),
    });
    return transaction;
  }

  async burnLiquidityData(poolId: string, liquidityAmount: number) {
    const poolInfo = await this.getPoolInfo(poolId);
    const coinA = poolInfo.x_TokenType;
    const coinB = poolInfo.y_TokenType;

    const data = {
      function: `${this.config.PACKAGE_ID}::coin_pair_service::burn_liquidity` as MoveFunctionId,
      functionArguments: [poolId, liquidityAmount],
      typeArguments: [coinA, coinB],
    } as InputGenerateTransactionPayloadData;
    return data;
  }

  async burnLiquidity(client: Aptos, user: string, poolId: string, liquidityAmount: number) {
    const transaction = await client.transaction.build.simple({
      sender: user,
      data: await this.burnLiquidityData(poolId, liquidityAmount),
    });
    return transaction;
  }

  async getPoolMetaData({
    poolId,
    tokenXType,
    tokenYType,
  }: {
    poolId: string;
    tokenXType?: string;
    tokenYType?: string;
  }) {
    let poolInfo;

    if (!tokenXType && !tokenYType) {
      poolInfo = await this.getPoolInfo(poolId);
    }

    const tokenAType = tokenXType || poolInfo.x_TokenType;
    const tokenBType = tokenYType || poolInfo.y_TokenType;
    const poolType = `${this.config.PACKAGE_ID}::coin_pair::CoinPair<${tokenAType},${tokenBType}>`;
    const fetchUrl = `${this.config.INTERNAL_INDEXER_URL}/accounts/${poolId}/resource/${poolType}`;
    const response = await fetch(fetchUrl);
    const data = await response.json();
    return data;
  }

  async getSwapYPriceData(poolId: string, amount: number, a2b: boolean, minimumYAmount: number) {
    const reserveInfo = await this.getPoolMetaData({ poolId });
    const reserveInfoData = reserveInfo.data;

    return this.calculateSwapYPriceData(reserveInfoData, amount, a2b, minimumYAmount);
  }
}
