import {
  Account,
  Aptos,
  InputGenerateTransactionPayloadData,
  MoveFunctionId,
  SimpleTransaction,
} from '@aptos-labs/ts-sdk';
import { SDKConfig } from '../config';

export class LunchpadModule {
  protected client: Aptos;
  protected senderAddress: string;
  protected config: SDKConfig;

  constructor(client: Aptos, senderAddress: string, sdkConfig: SDKConfig) {
    this.client = client;
    this.senderAddress = senderAddress;
    this.config = sdkConfig;
  }

  async getLaunchPoolState(launchPoolId: string) {
    const resourcePath = `${this.config.PACKAGE_ID}::launch_pool::LaunchPool<${`0x1::aptos_coin::AptosCoin`}>`;
    const fetchUrl = `${this.config.INTERNAL_INDEXER_URL}/accounts/${launchPoolId}/resource/${resourcePath}`;

    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
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
  async getCollateralPrice(launchPoolId: string, tokenDecimals: number, curvePosition: number) {
    const launchPoolState = await this.getLaunchPoolState(launchPoolId);
    const constantProduct = launchPoolState.data.constant_product;
    const initialVirtualTokenReserve = launchPoolState.data.initial_virtual_token_reserve;

    return await this.client.view({
      payload: this.getCollateralPriceData(
        constantProduct,
        initialVirtualTokenReserve,
        tokenDecimals,
        curvePosition
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
    const payload = await this.getTokensToMigrateData(launchPoolId, migrationFee);
    return await this.client.view({
      payload,
    });
  }

  mintAndListDataIfReadyData(
    tokenSymbol: string,
    tokenName: string,
    iconURL: string,
    projectURL: string,
    collateralAmount: number,
    stakingPoolEnabled: [boolean],
    stakingPoolLeaderBoardSize: [number]
  ) {
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
      typeArguments: [`0x1::aptos_coin::AptosCoin`],
    };
    return data;
  }

  async mintAndListIfReady(
    tokenSymbol: string,
    tokenName: string,
    iconURL: string,
    projectURL: string,
    collateralAmount: number,
    stakingPoolEnabled: boolean = true, // default is true, if false, staking pool will not be created
    stakingPoolLeaderBoardSize: number = 100 // default is 100, if 0, staking pool will not be created
  ) {
    const transaction = await this.client.transaction.build.simple({
      sender: this.senderAddress,
      data: this.mintAndListDataIfReadyData(
        tokenSymbol,
        tokenName,
        iconURL,
        projectURL,
        collateralAmount,
        [stakingPoolEnabled],
        [stakingPoolLeaderBoardSize]
      ),
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
      typeArguments: [`0x1::aptos_coin::AptosCoin`],
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
      data: this.buyTokenData(launchPoolId, collateralAmount, expectedTokenAmount),
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
      function: `${this.config.PACKAGE_ID}::launchpad_service::sell` as MoveFunctionId,
      functionArguments: [launchPoolId, tokenMetadata, tokenAmount, expectedCollateralAmount],
      typeArguments: [`0x1::fungible_asset::Metadata`, `0x1::aptos_coin::AptosCoin`],
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
      data: this.sellTokenData(launchPoolId, tokenMetadata, tokenAmount, expectedCollateralAmount),
    });
    return transaction;
  }

  migrateData(launchPoolId: string) {
    const data = {
      function: `${this.config.PACKAGE_ID}::launch_pool_aggregate::migrate` as MoveFunctionId,
      functionArguments: [launchPoolId],
      typeArguments: [`0x1::aptos_coin::AptosCoin`],
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
    stakingPoolEnabled: boolean = true, // default is true, if false, staking pool will not be created
    stakingPoolLeaderBoardSize: number = 100 // default is 100, if 0, staking pool will not be created
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
      typeArguments: [`0x1::aptos_coin::AptosCoin`],
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
    stakingPoolEnabled: boolean = true, // default is true, if false, staking pool will not be created
    stakingPoolLeaderBoardSize: number = 100 // default is 100, if 0, staking pool will not be created
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
      typeArguments: [`0x1::aptos_coin::AptosCoin`],
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
      data: this.mintAndDropBurntTokenData(tokenSymbol, tokenName, iconURL, projectURL),
    });
    return transaction;
  }
}
