// export const TESTNET_FULLNODE = "https://aptos.testnet.porto.movementlabs.xyz/v1";
// export const TESTNET_FAUCET = "https://fund.testnet.porto.movementlabs.xyz/";
// export const TESTNET_INDEXER = "https://indexer.testnet.porto.movementnetwork.xyz/v1/graphql";
// export const PACKAGE_ID = '0x2abe2aa6370bfdbe6bc3ce22f7dce1345fbc04f47e25dcd97c320468de0414ca';
// export const INTERNAL_INDEXER = 'http://ec2-34-212-167-187.us-west-2.compute.amazonaws.com:5011/api/TokenPairs';
// export const INTERNAL_RESERVE_INDEXER = "http://ec2-34-212-167-187.us-west-2.compute.amazonaws.com:5011/api/TokenPairPrices";

// export const TESTNET_FULLNODE = 'https://api.testnet.aptoslabs.com/v1';
// export const TESTNET_FAUCET = 'https://aptos.dev/en/network/faucet';
// export const TESTNET_INDEXER = 'https://api.testnet.aptoslabs.com/v1/graphql';
// export const PACKAGE_ID = '0xe8e1806fb3e05ba81c908e2496a94ac43d64edd900afa90272331eade684f2c7';
// export const INTERNAL_INDEXER_URL = 'https://fullnode.testnet.aptoslabs.com/v1';
// export const INTERNAL_INDEXER = 'https://aptos-testnet.api.flextech.xyz:443/api/TokenPairs';
// export const INTERNAL_RESERVE_INDEXER =
//   'https://aptos-testnet.api.flextech.xyz:443/api/TokenPairPrices';

export const CONFIG = {
  DEV: {
    FULLNODE: 'https://aptos.testnet.bardock.movementlabs.xyz/v1',
    FAUCET: 'https://faucet.testnet.bardock.movementnetwork.xyz/',
    INDEXER: 'https://indexer.testnet.movementnetwork.xyz/v1/graphql',
    PACKAGE_ID: '0x76ffc077ebde06ee2d20d819429f52a211934d97fc9fb0a98b07d241453ad139',
    INTERNAL_INDEXER_URL: 'https://aptos.testnet.bardock.movementlabs.xyz/v1',
    INTERNAL_INDEXER: 'http://bardock-testnet.api.flextech.xyz/api/TokenPairs',
    INTERNAL_RESERVE_INDEXER: 'http://bardock-testnet.api.flextech.xyz/api/TokenPairPrices',
  },
  MAINNET: {
    FULLNODE: 'https://mainnet.movementnetwork.xyz/v1',
    FAUCET: 'https://faucet.aptoslabs.com/',
    INDEXER: 'https://indexer.mainnet.movementnetwork.xyz/v1/graphql',
    PACKAGE_ID: '0xa116868a77b2a165cde60aa3c73cea3425e3a14b389847f0399adb06b07d357c',
    INTERNAL_INDEXER_URL: 'https://mainnet.movementnetwork.xyz/v1',
    INTERNAL_INDEXER: 'http://movement.api.flextech.xyz:80/api/TokenPairs',
    INTERNAL_RESERVE_INDEXER: 'http://movement.api.flextech.xyz:80/api/TokenPairPrices',
  },
};
