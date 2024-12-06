import { Aptos, AptosConfig, Account, SimpleTransaction, InputGenerateTransactionPayloadData, MoveFunctionId } from "@aptos-labs/ts-sdk";
import { PACKAGE_ID } from "../config";

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

    async getCoinPoolInfo(poolId: string) {
        const url = `http://ec2-34-212-167-187.us-west-2.compute.amazonaws.com:5011/api/CoinPairs/${poolId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        const data = await response.json();

        return data;
    }
    async getMixPoolInfo(poolId: string) {
        const url = `http://ec2-34-212-167-187.us-west-2.compute.amazonaws.com:5011/api/FungibleAssetCoinPairs/${poolId}`;
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
}