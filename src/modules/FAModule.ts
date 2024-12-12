import { Aptos, AptosConfig, Account, SimpleTransaction, InputGenerateTransactionPayloadData, MoveFunctionId } from "@aptos-labs/ts-sdk";
import { PoolModule } from "./poolModule";
import { PACKAGE_ID } from "../config";

export class FAModule extends PoolModule {

    protected client: Aptos;
    protected senderAddress: string;

    constructor(client: Aptos, senderAddress: string) {
        super(client, senderAddress);
        this.client = client;
        this.senderAddress = senderAddress;
    }

    async createPoolData(coinA: string, coinB: string, xAmount: number, yAmount: number, fee_numerator: number, fee_denominator: number) {

        const xLessThanY = await this.client.view({
            payload: this.checkAddressXLessThanYData(coinA, coinB)
        });

        if (xLessThanY[0] == false) {
            [coinA, coinB] = [coinB, coinA];
            [xAmount, yAmount] = [yAmount, xAmount];
        }

        const data = {
            function: `${PACKAGE_ID}::fungible_asset_pair_service::initialize_liquidity` as MoveFunctionId,
            functionArguments: [
                coinA,
                xAmount,
                coinB,
                yAmount,
                fee_numerator,
                fee_denominator
            ],
            typeArguments: [
                "0x1::fungible_asset::Metadata",
                "0x1::fungible_asset::Metadata"
            ],
        } as InputGenerateTransactionPayloadData;
        return data;
    }
    async createPool(client: Aptos, user: string, coinA: string, coinB: string, xAmount: number, yAmount: number, fee_numerator: number, fee_denominator: number) {
        const transaction = await client.transaction.build.simple({
            sender: user,
            data: await this.createPoolData(coinA, coinB, xAmount, yAmount, fee_numerator, fee_denominator)
        });
        return transaction;
    }
    async swapCoinData(poolId: string, a2b: boolean, amount: number, minimumYAmount: number) {
        const poolInfo = await this.getPoolInfo(poolId);
        const coinA = poolInfo.x_TokenType;
        const coinB = poolInfo.y_TokenType;
        if (a2b) {
            const data = {
                function: `${PACKAGE_ID}::fungible_asset_pair_service::swap_x` as MoveFunctionId,
                functionArguments: [
                    poolId,
                    coinA,
                    amount,
                    minimumYAmount
                ],
                typeArguments: [
                    '0x1::fungible_asset::Metadata',
                ],
            } as InputGenerateTransactionPayloadData;
            return data;
        }
        else {
            const data = {
                function: `${PACKAGE_ID}::fungible_asset_pair_service::swap_y` as MoveFunctionId,
                functionArguments: [
                    poolId,
                    coinB,
                    amount,
                    minimumYAmount
                ],
                typeArguments: [
                    '0x1::fungible_asset::Metadata',

                ],
            } as InputGenerateTransactionPayloadData;
            return data;
        }
    }
    async swapCoin(client: Aptos, user: string, poolId: string, a2b: boolean, amount: number, minimumYAmount: number) {
        const transaction = await client.transaction.build.simple({
            sender: user,
            data: await this.swapCoinData(poolId, a2b, amount, minimumYAmount)
        });
        return transaction;
    }
    async addLiquidityData(poolId: string, xAmount: number, yAmount: number) {
        const poolInfo = await this.getPoolInfo(poolId);
        const coinA = poolInfo.x_TokenType;
        const coinB = poolInfo.y_TokenType;

        const data = {
            function: `${PACKAGE_ID}::fungible_asset_pair_service::add_liquidity` as MoveFunctionId,
            functionArguments: [
                poolId,
                coinA,
                xAmount,
                coinB,
                yAmount,
                []
            ],
            typeArguments: [
                '0x1::fungible_asset::Metadata',
                '0x1::fungible_asset::Metadata'
            ],
        } as InputGenerateTransactionPayloadData;
        return data;
    }

    async addLiquidity(client: Aptos, user: string, poolId: string, xAmount: number, yAmount: number) {
        const transaction = await client.transaction.build.simple({
            sender: user,
            data: await this.addLiquidityData(poolId, xAmount, yAmount)
        });
        return transaction;
    }

    async removeLiquidityData(poolId: string, liquidityAmount: number) {
        // const poolInfo = await this.getPoolInfo(poolId);
        // const coinA = poolInfo.x_TokenType;
        // const coinB = poolInfo.y_TokenType;

        const data = {
            function: `${PACKAGE_ID}::fungible_asset_pair_service::remove_liquidity` as MoveFunctionId,
            functionArguments: [
                poolId,
                liquidityAmount,
                [],
                []
            ],
            typeArguments: [
            ],
        } as InputGenerateTransactionPayloadData;
        return data;
    }

    async removeLiquidity(client: Aptos, user: string, poolId: string, liquidityAmount: number) {
        const transaction = await client.transaction.build.simple({
            sender: user,
            data: await this.removeLiquidityData(poolId, liquidityAmount)
        });
        return transaction;
    }

    async burnLiquidityData(poolId: string, liquidityAmount: number) {
        // const poolInfo = await this.getPoolInfo(poolId);
        // const coinA = poolInfo.x_TokenType;
        // const coinB = poolInfo.y_TokenType;

        const data = {
            function: `${PACKAGE_ID}::fungible_asset_pair_service::burn_liquidity` as MoveFunctionId,
            functionArguments: [
                poolId,
                liquidityAmount
            ],
            typeArguments: [
            ],
        } as InputGenerateTransactionPayloadData;
        return data;
    }

    async burnLiquidity(client: Aptos, user: string, poolId: string, liquidityAmount: number) {
        const transaction = await client.transaction.build.simple({
            sender: user,
            data: await this.burnLiquidityData(poolId, liquidityAmount)
        });
        return transaction;
    }
}