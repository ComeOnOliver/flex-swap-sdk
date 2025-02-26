import {
  Account,
  Aptos,
  InputGenerateTransactionPayloadData,
  MoveFunctionId,
  SimpleTransaction,
} from '@aptos-labs/ts-sdk';

import { CONFIG, SDKConfig } from "../config";

export class PoolModule {
  protected client: Aptos;
  protected senderAddress: string;
  protected config: SDKConfig;

  constructor(client: Aptos, senderAddress: string, sdkConfig: SDKConfig) {
    this.client = client;
    this.senderAddress = senderAddress;
    this.config = sdkConfig;
  }

  async signAndSubmitTransaction(client: Aptos, sender: Account, transaction: SimpleTransaction) {
    const committedTransaction = await client.signAndSubmitTransaction({
      transaction,
      signer: sender,
    });

    const executedTransaction = await client.waitForTransaction({
      transactionHash: committedTransaction.hash,
    });
    return executedTransaction;
  }

  transferAptosData(from: string, destination: string, amount: number) {
    const data = {
      function:
        '0x2abe2aa6370bfdbe6bc3ce22f7dce1345fbc04f47e25dcd97c320468de0414ca::coin_example::transfer' as MoveFunctionId,
      functionArguments: [from, destination, amount],
    } as InputGenerateTransactionPayloadData;
    return data;
  }
  async transferAptosTransaction(client: Aptos, from: string, destination: string, amount: number) {
    const transaction = await client.transaction.build.simple({
      sender: from,
      data: this.transferAptosData(from, destination, amount),
    });
    return transaction;
  }
  checkBalanceData(coinType: string) {
    const data = {
      function: '0x1::fungible_asset::balance' as MoveFunctionId,
      functionArguments: [coinType],
      typeArguments: ['0x1::fungible_asset::FungibleStore'],
    };
    return data;
  }
  checkMetaDataObject(objectAddress: string) {
    const data = {
      function: '0x1::fungible_asset::store_metadata' as MoveFunctionId,
      functionArguments: [objectAddress],
      typeArguments: ['0x1::fungible_asset::FungibleStore'],
    };
    return data;
  }
  checkIfRegsiterCoinData(user: string, coinType: string) {
    const data = {
      function: '0x1::coin::is_account_registered' as MoveFunctionId,
      functionArguments: [user],
      typeArguments: [coinType],
    };
    return data;
  }
  checkXLessThanYData(x: string, y: string) {
    const data = {
      function: `${this.config.PACKAGE_ID}::token_util::is_type_less_than` as MoveFunctionId,
      functionArguments: [],
      typeArguments: [x, y],
    };
    return data;
  }
  checkAddressXLessThanYData(x: string, y: string) {
    const data = {
      function: `${this.config.PACKAGE_ID}::token_util::is_address_less_than` as MoveFunctionId,
      functionArguments: [x, y],
    };
    return data;
  }
  async getSwapYPriceData(poolId: string, amount: number, a2b: boolean, minimumYAmount: number) {
    const reserveInfo = await this.getPoolInfo(poolId);

    const [reserveA, reserveB] = a2b
      ? [reserveInfo.x_ReserveValue, reserveInfo.y_ReserveValue]
      : [reserveInfo.y_ReserveValue, reserveInfo.x_ReserveValue];
    const { feeNumerator, feeDenominator } = reserveInfo;
    return {
      function: `${this.config.PACKAGE_ID}::swap_util::swap` as MoveFunctionId,
      functionArguments: [reserveA, reserveB, amount, minimumYAmount, feeNumerator, feeDenominator],
    };
  }

  async getSwapYPriceByAmountOut(reserveInfoData: any, a2b: boolean, minimumXAmount: number) {
    const [reserveA, reserveB] = a2b
      ? [Number(reserveInfoData.x_reserve.value), Number(reserveInfoData.y_reserve.value)]
      : [Number(reserveInfoData.y_reserve.value), Number(reserveInfoData.x_reserve.value)];
    const feeNumerator = reserveInfoData.fee_numerator;
    const feeDenominator = reserveInfoData.fee_denominator;

    // if (minimumXAmount >= Number(reserveA)) {
    //   throw new Error('Exceed maximum amount of Reserve Liquidity');
    // }
    const xForCalculate = Math.min(minimumXAmount, Number(reserveA));
    // Calculate x_out_with_fee
    let xOutWithFee =
      (xForCalculate * feeDenominator + (feeDenominator - feeNumerator - 1)) /
      (feeDenominator - feeNumerator);

    // Ensure minimum fee
    const MIN_X_FEE = 1; // Define a minimum fee constant
    if (xOutWithFee < MIN_X_FEE + xForCalculate) {
      xOutWithFee = MIN_X_FEE + xForCalculate;
    }

    // Calculate constant product k
    const k = reserveA * reserveB;

    // Calculate required y_amount_in
    const yAmountIn = (k + (reserveA - xOutWithFee) - 1) / (reserveA - xOutWithFee) - reserveB;
    if (yAmountIn < 0) {
      return Number(reserveB);
    }
    // Verify the calculated amount using swap function
    const xAmountOut = this.swap_internal(
      reserveB,
      reserveA,
      yAmountIn,
      xForCalculate,
      feeNumerator,
      feeDenominator
    );

    if (xAmountOut < minimumXAmount) {
      throw new Error('EInsufficientInputAmount');
    }

    return yAmountIn;
  }

  async getPoolInfo(poolId: string) {
    const url = `${this.config.INTERNAL_INDEXER}/${poolId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const data = await response.json();
    return data;
  }

  async getReserveInfo(poolId: string) {
    const url = `${this.config.INTERNAL_RESERVE_INDEXER}/${poolId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const data = await response.json();
    return data;
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

  async calculateSwapYPriceData(
    reserveInfoData: any,
    amount: number,
    a2b: boolean,
    minimumYAmount: number
  ) {
    const [reserveA, reserveB] = a2b
      ? [Number(reserveInfoData.x_reserve.value), Number(reserveInfoData.y_reserve.value)]
      : [Number(reserveInfoData.y_reserve.value), Number(reserveInfoData.x_reserve.value)];
    const feeNumerator = reserveInfoData.fee_numerator;
    const feeDenominator = reserveInfoData.fee_denominator;

    return {
      function: `${this.config.PACKAGE_ID}::swap_util::swap` as MoveFunctionId,
      functionArguments: [reserveA, reserveB, amount, minimumYAmount, feeNumerator, feeDenominator],
    };
  }

  async getCoinInfo(client: Aptos, tokenAType: string) {
    const decimal = await client.view({
      payload: {
        function: '0x1::coin::decimals' as MoveFunctionId,
        typeArguments: [tokenAType],
      },
    });

    const name = await client.view({
      payload: {
        function: '0x1::coin::name' as MoveFunctionId,
        typeArguments: [tokenAType],
      },
    });
    const symbol = await client.view({
      payload: {
        function: '0x1::coin::symbol' as MoveFunctionId,
        typeArguments: [tokenAType],
      },
    });

    return {
      decimals: decimal[0],
      name: name[0],
      symbol: symbol[0],
    };
  }
  async getFATokenInfo(client: Aptos, tokenAType: string) {
    const decimal = await client.getAccountResource({
      accountAddress: tokenAType,
      resourceType: '0x1::fungible_asset::Metadata',
    });
    return decimal;
  }

  async calculateLiquidity(
    client: Aptos,
    totalSupplied: number,
    x_reserve: number,
    y_reserve: number,
    x_amount: number,
    y_amount: number
  ) {
    const result = await client.view({
      payload: {
        function:
          `${this.config.PACKAGE_ID}::liquidity_util::calculate_liquidity` as MoveFunctionId,
        functionArguments: [totalSupplied, x_reserve, y_reserve, x_amount, y_amount],
      },
    });
    return result;
  }

  swap_internal(
    xReserve: number,
    yReserve: number,
    xAmountIn: number,
    expectedYAmountOut: number,
    feeNumerator: number,
    feeDenominator: number
  ): number {
    let yAmountOut: number;
    const MIN_Y_FEE = 1; // Define a minimum fee constant for y
    const MIN_X_FEE = 1; // Define a minimum fee constant for x

    // Calculate constant product k = x * y
    const k = xReserve * yReserve;

    // Calculate output amount based on constant product formula
    yAmountOut = yReserve - Math.floor(k / (xReserve + xAmountIn));

    // Calculate fee based on output amount
    let yFee = Math.floor((yAmountOut * feeNumerator) / feeDenominator);
    // Ensure minimum fee
    if (yFee < MIN_Y_FEE) {
      yFee = MIN_Y_FEE;
    }

    // If calculated output (after fee) meets expected minimum
    if (yAmountOut >= expectedYAmountOut + yFee) {
      yAmountOut -= yFee;
    } else {
      // If not, try to fulfill exactly expected amount
      yAmountOut = expectedYAmountOut;
      // Calculate required input amount for expected output
      const xAmountRequired = Math.floor(k / (yReserve - yAmountOut)) - xReserve;

      // Calculate input fee
      let xFee = Math.floor((xAmountIn * feeNumerator) / feeDenominator);
      if (xFee < MIN_X_FEE) {
        xFee = MIN_X_FEE;
      }

      // Verify input amount is sufficient (including fee)
      if (xAmountIn < xAmountRequired + xFee) {
        throw new Error('EInsufficientInputAmount');
      }
    }

    // Final safety check: verify constant product invariant is maintained
    // This check is commented out in the original code for gas savings
    // if ((xReserve + xAmountIn) * (yReserve - yAmountOut) < k) {
    //   throw new Error('EInsufficientInputAmount');
    // }

    return yAmountOut;
  }

  getFacuetDropData() {
    const data = {
      function:
        `${this.config.PACKAGE_ID}::fungible_asset_coin_dual_faucet_service::drop` as MoveFunctionId,
      functionArguments: ['0xf941eee75b40dbb850411009cab34cec0704fd7110f3f1974b7bf8d8fcbb7c84'],
      typeArguments: [`${this.config.PACKAGE_ID}::fake_usd::FakeUSD`],
    } as InputGenerateTransactionPayloadData;
    return data;
  }

  async receiveFaucet(client: Aptos, user: string) {
    const transaction = await client.transaction.build.simple({
      sender: user,
      data: this.getFacuetDropData(),
    });
    return transaction;
  }
}
