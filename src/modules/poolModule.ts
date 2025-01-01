import { Aptos, AptosConfig, Account, SimpleTransaction, InputGenerateTransactionPayloadData, MoveFunctionId } from "@aptos-labs/ts-sdk";
import { INTERNAL_INDEXER, INTERNAL_RESERVE_INDEXER, PACKAGE_ID } from "../config";

export class PoolModule {

    protected client: Aptos;
    protected senderAddress: string;

    constructor(client: Aptos, senderAddress: string) {
        this.client = client;
        this.senderAddress = senderAddress;

    }

    async signAndSubmitTransaction(client: Aptos, sender: Account, transaction: SimpleTransaction) {
        const committedTransaction = await client.signAndSubmitTransaction({
            transaction,
            signer: sender,
        });

        const executedTransaction = await client.waitForTransaction({ transactionHash: committedTransaction.hash });
        return executedTransaction;
    }

    transferAptosData(from: string, destination: string, amount: number) {
        const data = {
            function: "0x2abe2aa6370bfdbe6bc3ce22f7dce1345fbc04f47e25dcd97c320468de0414ca::coin_example::transfer" as MoveFunctionId,
            functionArguments: [from, destination, amount],

        } as InputGenerateTransactionPayloadData;
        return data;
    }
    async transferAptosTransaction(client: Aptos, from: string, destination: string, amount: number) {

        const transaction = await client.transaction.build.simple({
            sender: from,
            data: this.transferAptosData(from, destination, amount)
        });
        return transaction;
    }
    checkBalanceData(coinType: string) {
        const data = {
            function: "0x1::fungible_asset::balance" as MoveFunctionId,
            functionArguments: [coinType],
            typeArguments: [
                '0x1::fungible_asset::FungibleStore'
            ],
        };
        return data;
    }
    checkMetaDataObject(objectAddress: string) {
        const data = {
            function: "0x1::fungible_asset::store_metadata" as MoveFunctionId,
            functionArguments: [objectAddress],
            typeArguments: [
                '0x1::fungible_asset::FungibleStore',
            ],
        };
        return data;
    }
    checkIfRegsiterCoinData(user: string, coinType: string) {
        const data = {
            function: "0x1::coin::is_account_registered" as MoveFunctionId,
            functionArguments: [user],
            typeArguments: [
                coinType
            ],
        };
        return data;
    }
    checkXLessThanYData(x: string, y: string) {
        const data = {
            function: `${PACKAGE_ID}::token_util::is_type_less_than` as MoveFunctionId,
            functionArguments: [
            ],
            typeArguments: [
                x,
                y
            ],
        };
        return data;
    }
    checkAddressXLessThanYData(x: string, y: string) {
        const data = {
            function: `${PACKAGE_ID}::token_util::is_address_less_than` as MoveFunctionId,
            functionArguments: [
                x,
                y
            ],
        };
        return data;
    }
    async getSwapYPriceData(poolId: string, amount: number, a2b: boolean, minimumYAmount: number) {
        const reserveInfo = await this.getPoolInfo(poolId);

        const [reserveA, reserveB] = a2b ? [reserveInfo.x_ReserveValue, reserveInfo.y_ReserveValue] : [reserveInfo.y_ReserveValue, reserveInfo.x_ReserveValue];
        const { feeNumerator, feeDenominator } = reserveInfo;
        return {
            function: `${PACKAGE_ID}::swap_util::swap` as MoveFunctionId,
            functionArguments: [
                reserveA,
                reserveB,
                amount,
                minimumYAmount,
                feeNumerator,
                feeDenominator
            ],
        };
    }

    async getPoolInfo(poolId: string) {
        const url = `${INTERNAL_INDEXER}/${poolId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    }

    async getReserveInfo(poolId: string) {
        const url = `${INTERNAL_RESERVE_INDEXER}/${poolId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    }

    registerCoinData(coinType: string) {
        const data = {
            function: `0x1::managed_coin::register` as MoveFunctionId,
            functionArguments: [
            ],
            typeArguments: [
                coinType
            ],
        } as InputGenerateTransactionPayloadData;
        return data;
    }
    async registerCoin(client: Aptos, user: string, coinType: string) {
        const transaction = await client.transaction.build.simple({
            sender: user,
            data: this.registerCoinData(coinType)
        });
        return transaction;
    }

    protected async calculateSwapYPriceData(reserveInfoData: any, amount: number, a2b: boolean, minimumYAmount: number) {

        const [reserveA, reserveB] = a2b ? [Number(reserveInfoData.x_reserve.value), Number(reserveInfoData.y_reserve.value)] : [Number(reserveInfoData.y_reserve.value), Number(reserveInfoData.x_reserve.value)];
        const feeNumerator = reserveInfoData.fee_numerator;
        const feeDenominator = reserveInfoData.fee_denominator;

        return {
            function: `${PACKAGE_ID}::swap_util::swap` as MoveFunctionId,
            functionArguments: [
                reserveA,
                reserveB,
                amount,
                minimumYAmount,
                feeNumerator,
                feeDenominator
            ],
        };
    }

}