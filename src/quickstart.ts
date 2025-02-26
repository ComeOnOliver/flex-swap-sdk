import dotenv from 'dotenv';

import { CONFIG } from './config';
import { FlexSDK } from './sdk';

dotenv.config();
// Specify which network to connect to via AptosConfig

const privateKey = process.env.PRIVATE_KEY || '';

console.log(CONFIG['Bardock Testnet']);
const sdk = new FlexSDK(CONFIG['Bardock Testnet'], privateKey);
console.log(`use this address: ${sdk.address}`);
// sdk.fetchAccountCoinAmount(sdk.address, '0x1::aptos_coin::AptosCoin').then(console.log);
// sdk.fetchAccountCoins(sdk.address).then(console.log);

// 查看 FungibleStore 的 metadata
// sdk.aptosClient.view({
//     payload: sdk.coinModule.checkMetaDataObject('0x9de15fdc7066726c95d6feb223a16a283f476dfda23bafd278412e23eacb153f')
// }).then(console.log);

// // 查看 FungibleStore 的 balance
// sdk.aptosClient.view({
//     payload: sdk.coinModule.checkBalanceData('0x9de15fdc7066726c95d6feb223a16a283f476dfda23bafd278412e23eacb153f')
// }).then(console.log);

const coinC = '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDC';
const coinD = '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDT';
// sdk.checkXLessThanY(coinC, coinD).then(console.log);

const coinA = '0x8efdee21af9001750b91fad222fc4b6383aa984ca393cbef5555a74554af8185';
const coinB = '0x2fbc6ff4a2ec557d85e3d1e6bf4fb68f81900baf54b395bc034bd680c0446fb7';
// sdk.checkAddressXLessThanY(coinA, coinB).then(console.log);
//注册 coin---------------------------------------------------------------------------------
// sdk.coinModule.registerCoin(sdk.aptosClient, sdk.address, '0x2abe2aa6370bfdbe6bc3ce22f7dce1345fbc04f47e25dcd97c320468de0414ca::mars_coin::MarsCoin').then(async transaction => {
//     await sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });

//创建 coin Pool---------------------------------------------------------------------------------
// 1. 拿到所有用户有的coin
// sdk.fetchAccountCoins(sdk.address).then(console.log);
// 2. 选择两个 coin 并拿到他们的 coinType， 比如 0x2abe2aa6370bfdbe6bc3ce22f7dce1345fbc04f47e25dcd97c320468de0414ca::mars_coin::MarsCoin 和 0x1::aptos_coin::AptosCoin
// 3. 创建 coin Pool
// const coinE = '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDT';
// const coinF = '0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDC';

//确定都已经 register Coin 了
// sdk.aptosClient.view({
//     payload: sdk.coinModule.checkIfRegsiterCoinData(sdk.address, coinA)
// }).then(console.log);

// sdk.coinModule.createCoinPool(sdk.aptosClient, sdk.address, coinE, coinF, 1000e6, 1000e6, 3, 1000).then(transaction => {
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

// sdk.mixPoolModule.createPool(sdk.aptosClient, sdk.address, coinA, coinB, 100e8, 1000e6, 3, 1000).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });

// const poolId = "0x5742efa7cbe4aec968e0235a0778add5d26f6447cf6c71ee912990557ce68554";

// 4. add mix liquidity
// sdk.mixPoolModule.addMixLiquidity(sdk.aptosClient, sdk.address, poolId, 100e8, 1000e6).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });

//5. swap coin
// sdk.mixPoolModule.swapCoin(sdk.aptosClient, sdk.address, poolId, false, 10e8, 0).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });

//6. remove mix liquidity
// sdk.mixPoolModule.removeMixLiquidity(sdk.aptosClient, sdk.address, poolId, 1000).then(transaction => {
//     sdk.poolModule.signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction).then(console.log);
// });

//get swap price
// const poolId = '0x5742efa7cbe4aec968e0235a0778add5d26f6447cf6c71ee912990557ce68554';
// sdk.getSwapYPrice(poolId, 10e8, true, 0).then(console.log);

///////////////////////////////////////////////////////////////
//get swap price
//1. get pool id, select coinA and coinB and query the api, should return the pool id, like this: 0x5742efa7cbe4aec968e0235a0778add5d26f6447cf6c71ee912990557ce68554
//2. get swap price, pass the poolid, amount of either x or y, and a2b, minimumYAmount (slippage)
//e.g. if to swap 10 usdc to USDT, which is a2b = True

//This is will return the amount of USDT that you expected to get

//e.g. if to swap 10 USDT to USDC, which is a2b = False
//sdk.poolModule.getSwapYPriceData(USDC_USDT_POOL_ID, 10e6, false, 0).then(console.log);
//This is will return the amount of USDC you expected to get

//3. clean decimals or round up

///////////////////////////////////////////////////////////////
//how to get my pools
//1. get all coins from wallet like this: sdk.fetchAccountCoins(sdk.address).then(console.log);
//2. filter those coins with coinType = 'liquidity', get their poolId -> 这步还没跑通
//3. based on the poolId, get users' liquidity amount for each coinA and coinB

///////////////////////////////////////////////////////////////
//how to add liquidity to a pool
//1. get poolId by using the indexer, https://aptos-testnet.api.flextech.xyz:443/api/TokenPairs/byTokenTypes
// e.g.
//xTokenType = 0xe8e1806fb3e05ba81c908e2496a94ac43d64edd900afa90272331eade684f2c7::moon_coin::MoonCoin
//yTokenType = 0xe8e1806fb3e05ba81c908e2496a94ac43d64edd900afa90272331eade684f2c7::mars_coin::MarsCoin
//2. Pass in the poolId, and the amount of x and y you want to add to function addLiquidity based on their coinType
// e.g.xTokenType/yTokenType are both v2 coin, then use FAModule.addLiquidity
//FAModule.addLiquidity(sdk.aptosClient, sdk.address, poolId, 10e8, 10e8)

//if xTokenType/yTokenType are both v1 coin, then use CoinModule.addLiquidity
//CoinModule.addLiquidity(sdk.aptosClient, sdk.address, poolId, 10e8, 10e8)

// sdk.coinModule.getPoolMetaData('0x22b7ffd4787cd64f1345464d1fe76c2f7626589c6c094af254533f5d84370d2a').then(console.log);
// sdk.mixPoolModule.getPoolMetaData('0x73af1a64143f3c092dcbba56100f15529bac05402839420a1822081672160ca6').then(console.log);
// sdk.faModule.getPoolMetaData('0x3f51c22fe5a3a903fb447fa44601e3155c83629cce5149c3a34e38118a9c589c').then(console.log);

// sdk.getSwapYPrice('0x22b7ffd4787cd64f1345464d1fe76c2f7626589c6c094af254533f5d84370d2a', 10e8, true, 0, 'coin').then(console.log);
// sdk.getSwapYPrice('0x73af1a64143f3c092dcbba56100f15529bac05402839420a1822081672160ca6', 10e8, true, 0, 'mix').then(console.log);
// sdk.getSwapYPrice('0x3f51c22fe5a3a903fb447fa44601e3155c83629cce5149c3a34e38118a9c589c', 10e8, true, 0, 'fa').then(console.log);

// sdk.getPoolInfoByTokens('0xe8e1806fb3e05ba81c908e2496a94ac43d64edd900afa90272331eade684f2c7::moon_coin::MoonCoin',
//     '0xe8e1806fb3e05ba81c908e2496a94ac43d64edd900afa90272331eade684f2c7::fake_usd::FakeUSD').then(console.log);

// sdk.getPoolInfoByTokens('0xc76079ce147d055b7f196893e97e7fa547ac74dab5076b24a509dd4740e6ffeb',
//     '0xdc0f7602d5ec10c13729ce1a3e97e66b7678f0c22bee347c568c63fe5a01d9cd').then(console.log);

// sdk.getPoolIdBasedOnLiquidityToken('0x10724aa138a7d5f49b93f21079f1626b80fca5236b897d084246d46b97af0c0f').then(poolId => {

//   sdk.getPoolMetaData(poolId).then(console.log);
// });

// sdk.poolModule
//   .getFATokenInfo(
//     sdk.aptosClient,
//     "0x9a78e5e6dd0dae2550c4e56659b7dc7ded43c3fc9591eac636d89383bfcaffa"
//   )
//   .then(console.log);

// sdk.coinModule
//   .getCoinInfo(
//     sdk.aptosClient,
//     "0xe8e1806fb3e05ba81c908e2496a94ac43d64edd900afa90272331eade684f2c7::fake_usd::FakeUSD"
//   )
//   .then(console.log);

// sdk.poolModule.calculateLiquidity(sdk.aptosClient, 11998100, 200643897, 6614880151, 2000000, 6000000).then(console.log);

// sdk.poolModule.getCoinInfo(sdk.aptosClient,
//   '0xe8e1806fb3e05ba81c908e2496a94ac43d64edd900afa90272331eade684f2c7::fake_usd::FakeUSD'
// ).then(res => {
//   console.log(res);
// })

// sdk.poolModule
//   .getCoinInfo(
//     sdk.aptosClient,
//     '0xe8e1806fb3e05ba81c908e2496a94ac43d64edd900afa90272331eade684f2c7::moon_coin::MoonCoin'
//   )
//   .then((res) => {
//     console.log(res);
//   });

// sdk
//   .getSwapYPrice(
//     '0x22b7ffd4787cd64f1345464d1fe76c2f7626589c6c094af254533f5d84370d2a',
//     10e4,
//     true,
//     0,
//     'coin'
//   )
//   .then(console.log);
// sdk.poolModule
//   .getSwapYPriceData(
//     '0x22b7ffd4787cd64f1345464d1fe76c2f7626589c6c094af254533f5d84370d2a',
//     10e6,
//     true,
//     0
//   )
//   .then(console.log);

// sdk.poolModule
//   .getSwapYPriceByAmountOut(
//     '0x22b7ffd4787cd64f1345464d1fe76c2f7626589c6c094af254533f5d84370d2a',
//     false,
//     2292037
//   )
//   .then((result) => {
//     console.log(`resr`, result);
//   });

// sdk.lunchpadModule
//   .getCollateralPrice('0x1568082c2d372b4576957446c721ef7a07f6b0d83120e87aa26b152c72282854', 9)
//   .then(console.log);

// sdk.lunchpadModule
//   .getLaunchPoolState('0x5104cb0447facf3c2ec5e5af30f83a8a8a4dc838614982ea8eb0a48809d64429')
//   .then(console.log);

//Sample
// Output:{
//   type: '0x76ffc077ebde06ee2d20d819429f52a211934d97fc9fb0a98b07d241453ad139::launch_pool::LaunchPool<0x1::aptos_coin::AptosCoin>',
//   data: {
//     collateral_vault: { value: '99479532' },
//     completed: false,
//     constant_product: '139955682000000000000000000000',
//     dynamic_threshold: 8000,
//     initial_virtual_collateral_reserve: '130434000000',
//     initial_virtual_token_reserve: '1073000000000000000',
//     max_allocation_amount: '817400000000000000',
//     max_threshold: 8157,
//     migration_dex: { vec: '0x' },
//     migration_fee: { vec: [] },
//     min_allocation_amount: '799820983207404442',
//     staking_pool_address: { vec: [] },
//     staking_pool_enabled: { vec: [Array] },
//     staking_pool_leaderboard_size: { vec: [Array] },
//     token_allocation: '817733035608150',
//     token_burn_ref: { vec: [Array] },
//     token_vault: {
//       inner: '0x11c1d689c6e48d60029aa31406d4825dea35cec4c8024ebe39fb112148ce8e55'
//     },
//     total_supply: '1000000000000000000',
//     version: '2'
//   }
// }

// sdk.lunchpadModule
//   .getTokensToMigrate('0x5104cb0447facf3c2ec5e5af30f83a8a8a4dc838614982ea8eb0a48809d64429', 0)
//   .then(console.log);

// sdk.lunchpadModule
//   .mintAndListIfReady('HRS', 'HAAOO', 'https://test.com', 'https://test.com', 1000000, true, 100)
//   .then((transaction) => {
//     sdk.poolModule
//       .signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction)
//       .then(console.log);
//   });

//Generate Launch Pool ID is 0x5104cb0447facf3c2ec5e5af30f83a8a8a4dc838614982ea8eb0a48809d64429
//Buy 1Move token to get token
// sdk.lunchpadModule
//   .buyToken('0x5104cb0447facf3c2ec5e5af30f83a8a8a4dc838614982ea8eb0a48809d64429', 100000000, 1)
//   .then((transaction) => {
//     sdk.poolModule
//       .signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction)
//       .then(console.log);
//   });

//Sell 10000e9 token to get Move token
// sdk.lunchpadModule
//   .sellToken(
//     '0x5104cb0447facf3c2ec5e5af30f83a8a8a4dc838614982ea8eb0a48809d64429',
//     '0x65b61c555427be4960314c8cb17360da1f48aab45da048b80348425b660582e3',
//     10000e9,
//     1
//   )
//   .then((transaction) => {
//     sdk.poolModule
//       .signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction)
//       .then(console.log);
//   });

//get from facuet
// sdk.poolModule.receiveFaucet(sdk.aptosClient, sdk.address).then(transaction => {
//   sdk.poolModule
//     .signAndSubmitTransaction(sdk.aptosClient, sdk.account, transaction)
//     .then(console.log);
// });

// sdk.poolModule
//   .getFATokenInfo(
//     sdk.aptosClient,
//     '0x65b61c555427be4960314c8cb17360da1f48aab45da048b80348425b660582e3'
//   )
//   .then(console.log);

// sdk.lunchpadModule.getAllLaunchPools().then(console.log);
// sdk.lunchpadModule
//   .getLunchPoolById('0x1568082c2d372b4576957446c721ef7a07f6b0d83120e87aa26b152c72282854')
//   .then(console.log);
// sdk.lunchpadModule.getLunchPoolCount().then(console.log);
// sdk.lunchpadModule.getLunchPoolByPage(0, 5).then(console.log);

// sdk.lunchpadModule.getAptosVersion(0, '0x56f72b5331c663928304aaa6e27d6042dac4f5bc090828d2c9ff3bb80f7b99cd').then(console.log);

// sdk.lunchpadModule
//   .getCollateralPrice('0xfd111d27c9aed24e43ac71bfeb5e34e3b7c743c9c4be2b2d42d35220bd426bf4', 9)
//   .then(console.log);