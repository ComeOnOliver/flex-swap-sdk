import { Aptos, MoveFunctionId } from "@aptos-labs/ts-sdk";
import {
  LaunchPoolMetadata,
  LaunchPoolPageMetadata,
  TransformedLaunchPoolMetadata,
} from "../types";
import { SDKConfig } from "../config";

export class LunchpadModule {
  protected client: Aptos;
  protected senderAddress: string;
  protected config: SDKConfig;

  constructor(client: Aptos, senderAddress: string, sdkConfig: SDKConfig) {
    this.client = client;
    this.senderAddress = senderAddress;
    this.config = sdkConfig;
  }

  async transformLaunchPoolData(
    data: LaunchPoolMetadata[]
  ): Promise<TransformedLaunchPoolMetadata[]> {
    const results = await Promise.all(
      data.map(async (d) => {
        try {
          const pool = { ...d } as TransformedLaunchPoolMetadata;
          const { tokenBalance, tokenType } = await this.getTokenTypefromVault(
            pool.tokenVault
          );
          pool.tokenType = tokenType;

          const constantProduct = pool.constantProduct;
          const initialVirtualTokenReserve = pool.initialVirtualTokenReserve;
          const tokenAllocation = pool.tokenAllocation;

          const [price] = await this.client.view({
            payload: this.getCollateralPriceData(
              constantProduct,
              initialVirtualTokenReserve,
              9, //All lunchpad tokens have 9 decimals
              tokenAllocation
            ),
          });

          pool.marketCap = (Number(price) * pool.totalSupply) / 1e9; // 1e8 is the decimals of Move token
          pool.tokenReserve = Number(tokenBalance);
          return pool;
        } catch (error) {
          console.error(error);
          return undefined;
        }
      })
    );

    return results.filter(
      (pool): pool is TransformedLaunchPoolMetadata => pool !== undefined
    );
  }

  async getTokenTypefromVault(vaultAddress: string) {
    const data = await this.client.getAccountResource({
      accountAddress: vaultAddress,
      resourceType: "0x1::fungible_asset::FungibleStore",
    });

    return {
      tokenBalance: data.balance,
      tokenType: data.metadata.inner as string,
    };
  }

  async getAllLaunchPools() {
    const fetchUrl = `${this.config.INTERNAL_INDEXER_BASE_URL}/LaunchPools`;
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = (await response.json()) as LaunchPoolMetadata[];
    return this.transformLaunchPoolData(data);
  }

  async getLunchPoolCount() {
    const fetchUrl = `${this.config.INTERNAL_INDEXER_BASE_URL}/LaunchPools/_count`;
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = await response.json();

    return data as number;
  }

  async getLunchPoolByPage(
    page: number,
    size: number
  ): Promise<LaunchPoolPageMetadata> {
    const fetchUrl = `${this.config.INTERNAL_INDEXER_BASE_URL}/LaunchPools/_page?page=${page}&size=${size}`;
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    return await response.json();
  }

  async getLunchPoolById(launchPoolId: string) {
    const fetchUrl = `${this.config.INTERNAL_INDEXER_BASE_URL}/LaunchPools/${launchPoolId}`;
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = (await response.json()) as LaunchPoolMetadata;

    return data;
  }

  async getLaunchPoolState(launchPoolId: string) {
    const resourcePath = `${this.config.PACKAGE_ID}::launch_pool::LaunchPool<${this.config.COLLATERAL_TOKEN}>`;
    const fetchUrl = `${this.config.INTERNAL_INDEXER_URL}/accounts/${launchPoolId}/resource/${resourcePath}`;

    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = await response.json();

    return data;
  }

  getCollateralPriceData(
    constantProduct: number,
    initialVirtualTokenReserve: number,
    tokenDecimals: number,
    curvePosition: number
  ) {
    const data = {
      function:
        `${this.config.PACKAGE_ID}::constant_product_curve::get_collateral_price` as MoveFunctionId,
      functionArguments: [
        constantProduct,
        initialVirtualTokenReserve,
        tokenDecimals,
        curvePosition,
      ],
    };
    return data;
  }
  // get collateral price
  async getCollateralPrice(launchPoolId: string, tokenDecimals: number = 9) {
    const launchPoolState = await this.getLaunchPoolState(launchPoolId);
    // console.log(launchPoolState);
    const constantProduct = launchPoolState.data.constant_product;
    const initialVirtualTokenReserve =
      launchPoolState.data.initial_virtual_token_reserve;
    const tokenAllocation = launchPoolState.data.token_allocation;

    return await this.client.view({
      payload: this.getCollateralPriceData(
        constantProduct,
        initialVirtualTokenReserve,
        tokenDecimals,
        tokenAllocation
      ),
    });
  }

  async getTokensToMigrateData(launchPoolId: string, migrationFee: number) {
    const lunchPadState = await this.getLaunchPoolState(launchPoolId);
    const data = {
      function:
        `${this.config.PACKAGE_ID}::constant_product_curve::get_token_amount_to_migrate` as MoveFunctionId,
      functionArguments: [
        lunchPadState.data.constant_product,
        lunchPadState.data.initial_virtual_token_reserve,
        lunchPadState.data.initial_virtual_collateral_reserve,
        lunchPadState.data.token_allocation,
        migrationFee,
      ],
    };
    return data;
  }

  async getTokensToMigrate(launchPoolId: string, migrationFee: number) {
    const payload = await this.getTokensToMigrateData(
      launchPoolId,
      migrationFee
    );
    return await this.client.view({
      payload,
    });
  }
  mintAndListDataIfReadyData({
    tokenSymbol,
    tokenName,
    iconURL,
    projectURL = "",
    collateralAmount,
    stakingPoolEnabled = [], // default is [], if false, staking pool will not be created
    stakingPoolLeaderBoardSize = [], // default is [], if 0, staking pool will not be created
  }: {
    tokenSymbol: string;
    tokenName: string;
    iconURL: string;
    projectURL?: string;
    collateralAmount: number;
    stakingPoolEnabled?: boolean[];
    stakingPoolLeaderBoardSize?: number[];
  }) {
    const data = {
      function:
        `${this.config.PACKAGE_ID}::launchpad_service::mint_list_and_migrate_if_ready` as MoveFunctionId,
      functionArguments: [
        tokenSymbol,
        tokenName,
        iconURL,
        projectURL,
        collateralAmount,
        stakingPoolEnabled,
        stakingPoolLeaderBoardSize,
      ],
      typeArguments: [this.config.COLLATERAL_TOKEN],
    };
    return data;
  }

  async mintAndListIfReady(
    tokenSymbol: string,
    tokenName: string,
    iconURL: string,
    projectURL: string,
    collateralAmount: number,
    stakingPoolEnabled: boolean[] = [],
    stakingPoolLeaderBoardSize: number[] = []
  ) {
    const transaction = await this.client.transaction.build.simple({
      sender: this.senderAddress,
      data: this.mintAndListDataIfReadyData({
        tokenSymbol,
        tokenName,
        iconURL,
        projectURL,
        collateralAmount,
        stakingPoolEnabled,
        stakingPoolLeaderBoardSize,
      }),
    });
    return transaction;
  }

  buyTokenData(
    launchPoolId: string,
    collateralAmount: number,
    expectedTokenAmount: number = 1 //Minimum token amount to receive
  ) {
    const data = {
      function:
        `${this.config.PACKAGE_ID}::launchpad_service::buy_and_migrate_if_ready` as MoveFunctionId,
      functionArguments: [launchPoolId, collateralAmount, expectedTokenAmount],
      typeArguments: [this.config.COLLATERAL_TOKEN],
    };
    return data;
  }

  async buyToken(
    launchPoolId: string,
    collateralAmount: number,
    expectedTokenAmount: number = 1 //Minimum token amount to receive
  ) {
    const transaction = await this.client.transaction.build.simple({
      sender: this.senderAddress,
      data: this.buyTokenData(
        launchPoolId,
        collateralAmount,
        expectedTokenAmount
      ),
    });
    return transaction;
  }

  sellTokenData(
    launchPoolId: string,
    tokenMetadata: string,
    tokenAmount: number,
    expectedCollateralAmount: number = 1 //Minimum collateral amount to receive
  ) {
    const data = {
      function:
        `${this.config.PACKAGE_ID}::launchpad_service::sell` as MoveFunctionId,
      functionArguments: [
        launchPoolId,
        tokenMetadata,
        tokenAmount,
        expectedCollateralAmount,
      ],
      typeArguments: [
        `0x1::fungible_asset::Metadata`,
        `${this.config.COLLATERAL_TOKEN}`,
      ],
    };
    return data;
  }

  async sellToken(
    launchPoolId: string,
    tokenMetadata: string,
    tokenAmount: number,
    expectedCollateralAmount: number = 1 //Minimum collateral amount to receive
  ) {
    const transaction = await this.client.transaction.build.simple({
      sender: this.senderAddress,
      data: this.sellTokenData(
        launchPoolId,
        tokenMetadata,
        tokenAmount,
        expectedCollateralAmount
      ),
    });
    return transaction;
  }

  migrateData(launchPoolId: string) {
    const data = {
      function:
        `${this.config.PACKAGE_ID}::launch_pool_aggregate::migrate` as MoveFunctionId,
      functionArguments: [launchPoolId],
      typeArguments: [this.config.COLLATERAL_TOKEN],
    };
    return data;
  }

  async migrate(launchPoolId: string) {
    const transaction = await this.client.transaction.build.simple({
      sender: this.senderAddress,
      data: this.migrateData(launchPoolId),
    });
    return transaction;
  }

  mintAndMigrateData(
    tokenSymbol: string,
    tokenName: string,
    iconURL: string,
    projectURL: string,
    collateralAmount: number,
    stakingPoolEnabled: boolean[] = [], // default is [], if false, staking pool will not be created
    stakingPoolLeaderBoardSize: number[] = [] // default is [], if 0, staking pool will not be created
  ) {
    const data = {
      function:
        `${this.config.PACKAGE_ID}::launchpad_service::mint_list_and_migrate` as MoveFunctionId,
      functionArguments: [
        tokenSymbol,
        tokenName,
        iconURL,
        projectURL,
        collateralAmount,
        stakingPoolEnabled,
        stakingPoolLeaderBoardSize,
      ],
      typeArguments: [this.config.COLLATERAL_TOKEN],
    };
    return data;
  }
  //Make sure account has enough collateral
  async mintAndMigrate(
    tokenSymbol: string,
    tokenName: string,
    iconURL: string,
    projectURL: string,
    collateralAmount: number,
    stakingPoolEnabled: boolean[] = [], // default is [], if false, staking pool will not be created
    stakingPoolLeaderBoardSize: number[] = [] // default is [], if 0, staking pool will not be created
  ) {
    const transaction = await this.client.transaction.build.simple({
      sender: this.senderAddress,
      data: this.mintAndMigrateData(
        tokenSymbol,
        tokenName,
        iconURL,
        projectURL,
        collateralAmount,
        stakingPoolEnabled,
        stakingPoolLeaderBoardSize
      ),
    });
    return transaction;
  }

  mintAndDropBurntTokenData(
    tokenSymbol: string,
    tokenName: string,
    iconURL: string,
    projectURL: string
  ) {
    const data = {
      function:
        `${this.config.PACKAGE_ID}::launchpad_service::mint_and_drop_burnt_token` as MoveFunctionId,
      functionArguments: [tokenSymbol, tokenName, iconURL, projectURL],
      typeArguments: [this.config.COLLATERAL_TOKEN],
    };
    return data;
  }

  async mintAndDropBurntToken(
    tokenSymbol: string,
    tokenName: string,
    iconURL: string,
    projectURL: string
  ) {
    const transaction = await this.client.transaction.build.simple({
      sender: this.senderAddress,
      data: this.mintAndDropBurntTokenData(
        tokenSymbol,
        tokenName,
        iconURL,
        projectURL
      ),
    });
    return transaction;
  }

  async getAptosVersion(
    aptosVersion: number,
    launchPoolId: string,
    limit: number = 1000
  ) {
    const fetchUrl = `${this.config.INTERNAL_RESERVE_INDEXER}/${launchPoolId}/after/${aptosVersion}?limit=${limit}`;

    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = await response.json();

    return data;
  }
}
