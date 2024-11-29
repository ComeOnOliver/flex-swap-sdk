import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { PACKAGE_ID } from "../config";
export class PoolModule {

    protected client: Aptos;
    protected senderAddress: string;

    constructor(client: Aptos, senderAddress: string) {
        this.client = client;
        this.senderAddress = senderAddress;
    }

    async transferAptos(destination: string, amount: number) {

        await this.client.fundAccount({ accountAddress: this.senderAddress, amount: 100_000_000 });
    //     const transaction = await this.client.transaction.build.simple({
    //         sender: this.senderAddress,
    //         data: {
    //             // All transactions on Aptos are implemented via smart contracts.
    //             function: "0x1::aptos_account::transfer",
    //             functionArguments: [destination, amount],
    //         },
    //     });


    //     const committedTransaction = await this.client.signAndSubmitTransaction({
    //         transaction,
    //         signer: this.client.account as any,
    //     });

        //     // 5. Wait
        //     const executedTransaction = await this.client.waitForTransaction({ transactionHash: committedTransaction.hash });
        //     return executedTransaction;
    }
}
