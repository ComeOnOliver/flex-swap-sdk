import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import dotenv from 'dotenv';
dotenv.config();

// Specify which network to connect to via AptosConfig

const accountAddress = process.env.TEST_ADDRESS || "";

async function example() {
    console.log(
        "This example will create two accounts (Alice and Bob), fund them, and transfer between them.",
    );

    // Setup the client
    const config = new AptosConfig({
        network: Network.CUSTOM, fullnode: "https://aptos.testnet.porto.movementlabs.xyz/v1",
        faucet: "https://fund.testnet.porto.movementlabs.xyz/",
        indexer: "https://indexer.testnet.porto.movementnetwork.xyz/v1/graphql",
    });
    const aptos = new Aptos(config);

    const ledgerInfo = await aptos.getLedgerInfo();
    const modules = await aptos.getAccountModules({ accountAddress: accountAddress });
    const tokens = await aptos.getAccountOwnedTokens({ accountAddress: accountAddress });
    const coins = await aptos.getAccountCoinsData({ accountAddress: accountAddress });
    console.log(ledgerInfo);
    console.log(coins);
}

example()