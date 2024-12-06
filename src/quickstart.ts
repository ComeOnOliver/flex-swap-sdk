import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import dotenv from 'dotenv';
import { FlexSDK } from "./sdk";
dotenv.config();

// Specify which network to connect to via AptosConfig

const privateKey = process.env.PRIVATE_KEY || '';
const TESTNET_FULLNODE = process.env.TESTNET_FULLNODE || '';
const TESTNET_INDEXER = process.env.TESTNET_INDEXER || '';
const TESTNET_FAUCET = process.env.TESTNET_FAUCET || '';
console.log(TESTNET_INDEXER);
const sdk = new FlexSDK({
    network: Network.CUSTOM,
    fullnode: TESTNET_FULLNODE,
    indexer: TESTNET_INDEXER,
    faucet: TESTNET_FAUCET
}, privateKey);
console.log(`use this address: ${sdk.address}`);
// sdk.fetchAccountCoinAmount(sdk.address, '0x1::aptos_coin::AptosCoin').then(console.log);
// sdk.fetchAccountCoins(sdk.address).then(console.log);

// 查看 FungibleStore 的 metadata
sdk.aptosClient.view({
    payload: sdk.coinModule.checkMetaDataObject('0x9de15fdc7066726c95d6feb223a16a283f476dfda23bafd278412e23eacb153f')
}).then(console.log);

// 查看 FungibleStore 的 balance
sdk.aptosClient.view({
    payload: sdk.coinModule.checkBalanceData('0x9de15fdc7066726c95d6feb223a16a283f476dfda23bafd278412e23eacb153f')
}).then(console.log);


//注册 coin---------------------------------------------------------------------------------
// sdk.coinModule.registerCoin(sdk.aptosClient, sdk.address, '0x2abe2aa6370bfdbe6bc3ce22f7dce1345fbc04f47e25dcd97c320468de0414ca::mars_coin::MarsCoin').then(async transaction => {
//     await sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);    
// });

//创建 coin Pool---------------------------------------------------------------------------------
// 1. 拿到所有用户有的coin
// sdk.fetchAccountCoins(sdk.address).then(console.log);
// 2. 选择两个 coin 并拿到他们的 coinType， 比如 0x2abe2aa6370bfdbe6bc3ce22f7dce1345fbc04f47e25dcd97c320468de0414ca::mars_coin::MarsCoin 和 0x1::aptos_coin::AptosCoin
// 3. 创建 coin Pool
// const coinA = '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDC';
// const coinB = '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDT';

//确定都已经 register Coin 了
// sdk.aptosClient.view({
//     payload: sdk.coinModule.checkIfRegsiterCoinData(sdk.address, coinA)
// }).then(console.log);

// sdk.coinModule.createCoinPool(sdk.aptosClient, sdk.address, coinA, coinB, 1000e6, 1000e6, 3, 1000).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });
//得到 poolID = 0x23ad6d92e1b7bf22dbfa6f41c74862962b7d2c5d7c86cd633fb015793db31cb6

// 4. swap coin
// const poolId = '0x23ad6d92e1b7bf22dbfa6f41c74862962b7d2c5d7c86cd633fb015793db31cb6';
// 获取 pool 信息, not required
// sdk.poolModule.getPoolInfo(poolId).then(console.log);
// 进行 swap
// sdk.coinModule.swapCoin(sdk.aptosClient, sdk.address, poolId, true, 10e6, 0).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });

// 5. add liquidity
// sdk.coinModule.addLiquidity(sdk.aptosClient, sdk.address, poolId, 10e6, 10e6).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });

// 6. remove liquidity
// sdk.coinModule.removeLiquidity(sdk.aptosClient, sdk.address, poolId, 1e8).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });
// 7. burn liquidity
// sdk.coinModule.burnLiquidity(sdk.aptosClient, sdk.address, poolId, 1e8).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });

//创建 mix pool---------------------------------------------------------------------------------
//X 必须是 fa, Y 必须是 coin
// const coinA = '0x8efdee21af9001750b91fad222fc4b6383aa984ca393cbef5555a74554af8185';
// const coinB = '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDC';

// sdk.mixPoolModule.createMixPool(sdk.aptosClient, sdk.address, coinA, coinB, 100e8, 1000e6, 3, 1000).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });

// const poolId = 0x5742efa7cbe4aec968e0235a0778add5d26f6447cf6c71ee912990557ce68554

// // 4. add mix liquidity
// sdk.mixPoolModule.addMixLiquidity(sdk.aptosClient, sdk.address, poolId, 100e8, 1000e6).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });
