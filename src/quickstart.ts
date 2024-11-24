import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import dotenv from 'dotenv';
import { FlexSDK } from "./sdk";
dotenv.config();

// Specify which network to connect to via AptosConfig

const privateKey = process.env.PRIVATE_KEY || '';
const TESTNET_FULLNODE = process.env.TESTNET_FULLNODE || '';
const TESTNET_INDEXER = process.env.TESTNET_INDEXER || '';
console.log(TESTNET_INDEXER);
const address = process.env.TEST_ADDRESS || '';
const sdk = new FlexSDK({
    network: Network.CUSTOM,
    fullnode: TESTNET_FULLNODE,
    indexer: TESTNET_INDEXER,
}, privateKey);
console.log(`use this address: ${sdk.senderAddress}`);

// sdk.client.getLedgerInfo().then(console.log);
// sdk.getAccountCoins().then(console.log);
sdk.getAccountCoinAmount(address, '0x1::aptos_coin::AptosCoin').then(console.log);
// const transaction = await sdk.transaction.build.simple({
//     sender: sdk.Account.account.accountAddress,
//     data: {
//         // All transactions on Aptos are implemented via smart contracts.
//         function: "0x1::aptos_account::transfer",
//         functionArguments: ['0x396bd2cc32bd054911f760581b176f61f9eaaa5008e835a351e5a428ea6ad139', 1],
//     },
// }).then((rawTx: any) => {
//     sdk.transaction.signAndSubmitTransaction({
//         signer: sdk.Account.account,
//         transaction: rawTx
//     }).then((rawTx: any) => {
//         const senderSignature = sdk.transaction.sign({ signer: sdk.Account.account, transaction: rawTx });
//         console.log("senderSignature :", senderSignature.bcsToHex().toString());
//         console.log("rawTx feePayerAddress :", rawTx.feePayerAddress?.toString());
//         console.log("rawTx :", rawTx.rawTransaction.bcsToHex().toString());
//         console.log("rawTx feePayerAddress :", rawTx.feePayerAddress?.toString());
//         console.log("rawTx secondarySignerAddresses :", rawTx.secondarySignerAddresses);
//         return {
//             rawTransaction: rawTx.rawTransaction.bcsToHex().toString(),
//             senderSignature: senderSignature.bcsToHex().toString()
//         };
//     });

// import { Ed25519PrivateKey, Account } from "@aptos-labs/ts-sdk";
// const privateKey2 = '55143bfaf0633b904ab5fd7bd41ae936e8e196a7e719e82a15b63afaa7fa7d48'
// const privateKey1 = "4a6d287353203941768551f66446d5d4a85ab685b5b444041801014ae39419b5067aec3603bdca82e52a172ec69b2505a979f1d935a59409bacae5c7f268fc26";
// // console.log(`pk:`, privateKey1.slice(0, 64));
// const ed25519PrivateKey = new Ed25519PrivateKey(privateKey2.slice(0, 64));
// const senderAccount = Account.fromPrivateKey({ privateKey: ed25519PrivateKey });
// console.log(senderAccount.accountAddress.toString());
