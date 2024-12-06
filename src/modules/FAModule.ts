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

    createFAPoolData(metadataX: string, xAmount: number, metadataY: string, yAmount: number, fee_numerator: number, fee_denominator: number) {
        const data = {
            function: `${PACKAGE_ID}::fungible_asset_pair_service::initialize_liquidity` as MoveFunctionId,
            functionArguments: [
                metadataX,
                xAmount,
                metadataY,
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
    async createFAPool(client: Aptos, user: string, metadataX: string, xAmount: number, metadataY: string, yAmount: number, fee_numerator: number, fee_denominator: number) {
        const transaction = await client.transaction.build.simple({
            sender: user,
            data: this.createFAPoolData(metadataX, xAmount, metadataY, yAmount, fee_numerator, fee_denominator)
        });
        return transaction;
    }
    FAswapXData(poolId: string, metadataX: string, xAmount: number, minimumYAmount: number) {
        const data = {
            function: `${PACKAGE_ID}::fungible_asset_pair_service::swap_x` as MoveFunctionId,
            functionArguments: [
                poolId,
                metadataX,
                xAmount,
                minimumYAmount
            ],
            typeArguments: [
                "0x1::fungible_asset::Metadata",
            ],
        } as InputGenerateTransactionPayloadData;
        return data;
    }
    async FAswapX(client: Aptos, user: string, poolId: string, metadataX: string, xAmount: number, minimumYAmount: number) {
        const transaction = await client.transaction.build.simple({
            sender: user,
            data: this.FAswapXData(poolId, metadataX, xAmount, minimumYAmount)
        });
        return transaction;
    }
}