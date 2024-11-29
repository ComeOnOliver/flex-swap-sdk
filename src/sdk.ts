import { AccountModule } from "./modules/accountModule";
import { PoolModule } from "./modules/poolModule";
// import { RpcModule } from "./modules/rpcModule";
import { AptosConfig, Aptos, AptosSettings, Network, MoveStructId } from "@aptos-labs/ts-sdk";
import { PACKAGE_ID, TESTNET_FAUCET } from "./config";
import { TESTNET_FULLNODE, TESTNET_INDEXER } from "./config";

export class FlexSDK {

    protected _accountModule: AccountModule
    public Pool: PoolModule
    protected _senderAddress = ''
    public client: Aptos;
    constructor(options: AptosSettings = { network: Network.CUSTOM, fullnode: TESTNET_FULLNODE, indexer: TESTNET_INDEXER, faucet: TESTNET_FAUCET }, privateKey?: string, address?: string) {
        this._accountModule = new AccountModule(privateKey, address);
        this._senderAddress = this._accountModule.address;

        const config = new AptosConfig({
            network: options.network,
            fullnode: options.fullnode,
            indexer: options.indexer,
            faucet: options.faucet
        });
        this.client = new Aptos(config);
        this.Pool = new PoolModule(this.client, this._senderAddress);
    }

    get senderAddress(): String {
        return this._senderAddress
    }

    set addSender(value: string) {
        this._senderAddress = value
    }

    async getAccountCoins(address: string = this._senderAddress) {
        return await this.client.getAccountCoinsData({ accountAddress: address });
    }
    async getAccountCoinAmount(address: string = this._senderAddress, coinType?: MoveStructId) {
        return await this.client.getAccountCoinAmount({ accountAddress: address, coinType: coinType });
    }

    get Account(): AccountModule {
        return this._accountModule
    }

    get packageId() {
        return PACKAGE_ID;
    }
}