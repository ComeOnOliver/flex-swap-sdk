import { Aptos, InputGenerateTransactionPayloadData, MoveFunctionId } from '@aptos-labs/ts-sdk';
import { PoolReserveData } from "../types";
import { SDKConfig } from "../config";
import { PoolModule } from "./poolModule";

export class FAModule extends PoolModule {
  constructor(client: Aptos, senderAddress: string, sdkConfig: SDKConfig) {
    super(client, senderAddress, sdkConfig);
  }

  async createPoolData(
    coinA: string,
    coinB: string,
    xAmount: number,
    yAmount: number,
    fee_numerator: number,
    fee_denominator: number
  ) {
    const xLessThanY = await this.client.view({
      payload: this.checkAddressXLessThanYData(coinA, coinB),
    });

    if (xLessThanY[0] == false) {
      [coinA, coinB] = [coinB, coinA];
      [xAmount, yAmount] = [yAmount, xAmount];
    }

    const data = {
      function:
        `${this.config.PACKAGE_ID}::fungible_asset_pair_service::initialize_liquidity` as MoveFunctionId,
      functionArguments: [
        coinA,
        xAmount,
        coinB,
        yAmount,
        fee_numerator,
        fee_denominator,
      ],
      typeArguments: [
        "0x1::fungible_asset::Metadata",
        "0x1::fungible_asset::Metadata",
      ],
    } as InputGenerateTransactionPayloadData;
    return data;
  }
  async createPool(
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
  async swapCoinData(
    poolId: string,
    a2b: boolean,
    amount: number,
    minimumYAmount: number
  ) {
    const poolInfo = await this.getPoolInfo(poolId);
    const coinA = poolInfo.x_TokenType;
    const coinB = poolInfo.y_TokenType;
    if (a2b) {
      const data = {
        function:
          `${this.config.PACKAGE_ID}::fungible_asset_pair_service::swap_x` as MoveFunctionId,
        functionArguments: [poolId, coinA, amount, minimumYAmount],
        typeArguments: ["0x1::fungible_asset::Metadata"],
      } as InputGenerateTransactionPayloadData;
      return data;
    } else {
      const data = {
        function:
          `${this.config.PACKAGE_ID}::fungible_asset_pair_service::swap_y` as MoveFunctionId,
        functionArguments: [poolId, coinB, amount, minimumYAmount],
        typeArguments: ["0x1::fungible_asset::Metadata"],
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
      function:
        `${this.config.PACKAGE_ID}::fungible_asset_pair_service::add_liquidity` as MoveFunctionId,
      functionArguments: [poolId, coinA, xAmount, coinB, yAmount, []],
      typeArguments: [
        "0x1::fungible_asset::Metadata",
        "0x1::fungible_asset::Metadata",
      ],
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
  }: {
    poolId: string;
    liquidityAmount: number;
  }) {
    // const poolInfo = await this.getPoolInfo(poolId);
    // const coinA = poolInfo.x_TokenType;
    // const coinB = poolInfo.y_TokenType;

    const data = {
      function:
        `${this.config.PACKAGE_ID}::fungible_asset_pair_service::remove_liquidity` as MoveFunctionId,
      functionArguments: [poolId, liquidityAmount, [], []],
      typeArguments: [],
    } as InputGenerateTransactionPayloadData;
    return data;
  }

  async removeLiquidity(
    client: Aptos,
    user: string,
    poolId: string,
    liquidityAmount: number
  ) {
    const transaction = await client.transaction.build.simple({
      sender: user,
      data: await this.removeLiquidityData({ poolId, liquidityAmount }),
    });
    return transaction;
  }

  async burnLiquidityData(poolId: string, liquidityAmount: number) {
    // const poolInfo = await this.getPoolInfo(poolId);
    // const coinA = poolInfo.x_TokenType;
    // const coinB = poolInfo.y_TokenType;

    const data = {
      function:
        `${this.config.PACKAGE_ID}::fungible_asset_pair_service::burn_liquidity` as MoveFunctionId,
      functionArguments: [poolId, liquidityAmount],
      typeArguments: [],
    } as InputGenerateTransactionPayloadData;
    return data;
  }

  async burnLiquidity(
    client: Aptos,
    user: string,
    poolId: string,
    liquidityAmount: number
  ) {
    const transaction = await client.transaction.build.simple({
      sender: user,
      data: await this.burnLiquidityData(poolId, liquidityAmount),
    });
    return transaction;
  }

  async getPoolMetaData({ poolId }: { poolId: string }) {
    const poolType = `${this.config.PACKAGE_ID}::fungible_asset_pair::FungibleAssetPair`;

    const fetchUrl = `${this.config.INTERNAL_INDEXER_URL}/accounts/${poolId}/resource/${poolType}`;
    const response = await fetch(fetchUrl);
    const data = await response.json();
    const faTokenBalanceA = data.data.x_reserve.inner;
    const faTokenBalanceB = data.data.y_reserve.inner;

    const fetchUrl2 = `${this.config.INTERNAL_INDEXER_URL}/accounts/${faTokenBalanceA}/resource/0x1::fungible_asset::FungibleStore`;
    const response2 = await fetch(fetchUrl2);
    const data2 = await response2.json();
    const xBalance = data2.data.balance;
    data.data.x_reserve = { value: xBalance };

    const fetchUrl3 = `${this.config.INTERNAL_INDEXER_URL}/accounts/${faTokenBalanceB}/resource/0x1::fungible_asset::FungibleStore`;
    const response3 = await fetch(fetchUrl3);
    const data3 = await response3.json();
    const yBalance = data3.data.balance;
    data.data.y_reserve = { value: yBalance };
    return data as PoolReserveData;
  }

  async getSwapYPriceData(
    poolId: string,
    amount: number,
    a2b: boolean,
    minimumYAmount: number
  ) {
    const reserveInfo = await this.getPoolMetaData({ poolId });
    const reserveInfoData = reserveInfo.data;
    return this.calculateSwapYPriceData(
      reserveInfoData,
      amount,
      a2b,
      minimumYAmount
    );
  }
}
