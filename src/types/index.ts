import { FAModule } from "../modules/FAModule";
import { MixPoolModule } from "../modules/mixPoolModule";
import { CoinModule } from "../modules/coinModule";

export type MovementNetwork = "Bardock Testnet" | "Mainnet";

export type TransactionType = "LAUNCH" | "BUY" | "SELL";

export type TransactionStatus = "awaiting" | "success" | "error";

export type PairType =
  | "FUNGIBLE_ASSET_PAIR"
  | "FUNGIBLE_ASSET_COIN_PAIR"
  | "COIN_PAIR"
  | "";

export type SdkModule = CoinModule | MixPoolModule | FAModule;

export interface LaunchTransaction {
  hash: string;
  symbol: string;
  name: string;
  icon_uri: string;
  status: TransactionStatus;
}

export type Transaction = LaunchTransaction;

export interface PoolMetadata {
  id: string;
  pairType: PairType;
  version: number;
  offChainVersion: number;
  x_ReserveValue: number;
  y_ReserveValue: number;
  totalLiquidity: number;
  liquidityBurned: number;
  feeNumerator: number;
  feeDenominator: number;
  k_Last: number;
  x_TokenType: string;
  y_TokenType: string;
  featureType: string;
}

export interface TokenPairMetadata {
  tokenPairId: string;
  y_TokenType: string;
  x_TokenType: string;
  x_ReserveValue: number;
  y_ReserveValue: number;
  liquidityTokenMetadata: string;
  pairType: PairType;
  x_TokenDecimals: number;
  x_TokenSymbol: string;
  x_TokenName: string;
  y_TokenDecimals: number;
  y_TokenSymbol: string;
  y_TokenName: string;
}

export interface PoolReserveData {
  type: string;
  data: {
    fee_denominator: string;
    fee_numerator: string;
    fee_to: {
      vec: any[];
    };
    k_last: string;
    liquidity_burned: string;
    total_liquidity: string;
    version: string;
    x_reserve: {
      value: string;
    };
    y_reserve: {
      value: string;
    };
  };
}

export interface CoinMetadata {
  icon_uri: string;
  project_uri: string;
  decimals: number;
  name: string;
  symbol: string;
}

export type MOVEMENT_NETWORK = "Bardock Testnet" | "Mainnet";

export interface LaunchPoolMetadata {
  id: string;
  totalSupply: number;
  initialVirtualTokenReserve: number;
  initialVirtualCollateralReserve: number;
  constantProduct: number;
  dynamicThreshold: number;
  maxThreshold: number;
  minAllocationAmount: number;
  maxAllocationAmount: number;
  tokenAllocation: number;
  tokenVault: string;
  collateralVault: {
    value: number;
  };
  completed: boolean;
  stakingPoolEnabled: boolean;
  stakingPoolLeaderboardSize: number;
  stakingPoolAddress: string;
  version: number;
  collateralType: string;
  offChainVersion: number;
}

export interface TransformedLaunchPoolMetadata extends LaunchPoolMetadata {
  tokenType: string;
  tokenReserve: number;
  marketCap: number;
}

export interface LaunchPoolPageMetadata {
  content: LaunchPoolMetadata[];
  totalElements: number;
  size: number;
  number: number;
}

export interface TransformedLaunchPoolPageMetadata {
  content: TransformedLaunchPoolMetadata[];
  totalElements: number;
  size: number;
  number: number;
}

export interface FileUploadResponse {
  id: string;
  originalFilename: string;
  storageFilename: string;
  contentType: string;
  size: number;
  userId: string;
  uploadTime: string;
  url: string;
  urlExpireTime: string | null;
  public: boolean;
}
