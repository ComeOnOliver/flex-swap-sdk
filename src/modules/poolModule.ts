import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { PACKAGE_ID } from "../config";
import { Transaction } from "@okxweb3/coin-aptos/dist/v2";
export class PoolModule {

    protected client: Aptos;
    protected senderAddress: string;

    constructor(client: Aptos, senderAddress: string) {
        this.client = client;
        this.senderAddress = senderAddress;
    }

    async createPool(coinAType: string, coinBType: string) {

    }
}
