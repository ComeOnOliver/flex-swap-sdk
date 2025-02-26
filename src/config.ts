import { MovementNetwork } from "./types";
export interface SDKConfig {
  FULLNODE: string;
  FAUCET: string;
  INDEXER: string;
  PACKAGE_ID: string;
  INTERNAL_INDEXER_URL: string;
  INTERNAL_INDEXER_BASE_URL: string;
  INTERNAL_INDEXER: string;
  INTERNAL_RESERVE_INDEXER: string;
  COLLATERAL_TOKEN: string;
}

const BARDOCK_TESTNET_CONFIG: SDKConfig = {
  FULLNODE: "https://aptos.testnet.bardock.movementlabs.xyz/v1",
  FAUCET: "https://faucet.testnet.bardock.movementnetwork.xyz/",
  INDEXER: "https://indexer.testnet.movementnetwork.xyz/v1/graphql",
  PACKAGE_ID:
    "0x76ffc077ebde06ee2d20d819429f52a211934d97fc9fb0a98b07d241453ad139",
  INTERNAL_INDEXER_URL: "https://aptos.testnet.bardock.movementlabs.xyz/v1",
  INTERNAL_INDEXER_BASE_URL: "https://bardock-testnet.api.flextech.xyz/api",
  INTERNAL_INDEXER: "https://bardock-testnet.api.flextech.xyz/api/TokenPairs",
  INTERNAL_RESERVE_INDEXER:
    "https://bardock-testnet.api.flextech.xyz/api/TokenPairPrices",
  COLLATERAL_TOKEN:
    "0x76ffc077ebde06ee2d20d819429f52a211934d97fc9fb0a98b07d241453ad139::fake_move::MOVE",
};

const MAINNET_CONFIG: SDKConfig = {
  FULLNODE: "https://mainnet.movementnetwork.xyz/v1",
  FAUCET: "https://faucet.aptoslabs.com/",
  INDEXER: "https://indexer.mainnet.movementnetwork.xyz/v1/graphql",
  PACKAGE_ID:
    "0xa116868a77b2a165cde60aa3c73cea3425e3a14b389847f0399adb06b07d357c",
  INTERNAL_INDEXER_URL: "https://mainnet.movementnetwork.xyz/v1",
  INTERNAL_INDEXER_BASE_URL: "https://movement.api.flextech.xyz/api",
  INTERNAL_INDEXER: "https://movement.api.flextech.xyz/api/TokenPairs",
  INTERNAL_RESERVE_INDEXER:
    "https://movement.api.flextech.xyz/api/TokenPairPrices",
  COLLATERAL_TOKEN: "0x1::aptos_coin::AptosCoin",
};

export const CONFIG: Record<MovementNetwork, SDKConfig> = {
  "Bardock Testnet": BARDOCK_TESTNET_CONFIG,
  Mainnet: MAINNET_CONFIG,
} as const;
