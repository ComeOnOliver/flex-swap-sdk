import { PoolModule } from "./modules/poolModule";
import { FAModule } from "./modules/FAModule";
import { CoinModule } from "./modules/coinModule";
// import { RpcModule } from "./modules/rpcModule";
import { AptosConfig, Aptos, AptosSettings, Network, MoveStructId, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { PACKAGE_ID, TESTNET_FAUCET } from "./config";
import { TESTNET_FULLNODE, TESTNET_INDEXER } from "./config";
import { MixPoolModule } from "./modules/mixPoolModule";

export class FlexSDK {

    public account: Account;
    public poolModule: PoolModule;
    public faModule: FAModule;
    public mixPoolModule: MixPoolModule;
    public coinModule: CoinModule;
    protected senderAddress = '';
    public aptosClient: Aptos;
    protected privateKeyHex;

    constructor(settings: AptosSettings = { network: Network.CUSTOM, fullnode: TESTNET_FULLNODE, indexer: TESTNET_INDEXER, faucet: TESTNET_FAUCET }, privateKey?: string) {
        if (!privateKey) {
            this.privateKeyHex = Account.generate().privateKey.toStringWithoutPrefix();
            console.log(`New private key generated: ${this.privateKeyHex}`);
        } else {
            this.privateKeyHex = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
        }
        const ed25519Key = new Ed25519PrivateKey(this.privateKeyHex.slice(0, 64));
        // Use asynchronous initialization to ensure account is ready after construction
        this.account = Account.fromPrivateKey({ privateKey: ed25519Key });
        this.senderAddress = this.account.accountAddress.toString();

        const aptosConfig = new AptosConfig({
            network: settings.network || Network.CUSTOM,
            fullnode: settings.fullnode || TESTNET_FULLNODE,
            indexer: settings.indexer || TESTNET_INDEXER,
            faucet: settings.faucet || TESTNET_FAUCET
        });
        this.aptosClient = new Aptos(aptosConfig);
        this.poolModule = new PoolModule(this.aptosClient, this.senderAddress);
        this.faModule = new FAModule(this.aptosClient, this.senderAddress);
        this.coinModule = new CoinModule(this.aptosClient, this.senderAddress);
        this.mixPoolModule = new MixPoolModule(this.aptosClient, this.senderAddress);
    }

    get address(): string {
        return this.senderAddress;
    }

    set updateSenderAddress(value: string) {
        this.senderAddress = value;
    }

    async fetchAccountCoins(accountAddress: string = this.senderAddress) {
        return await this.aptosClient.getAccountCoinsData({ accountAddress });
    }

    async fetchAccountCoinAmount(accountAddress: string = this.senderAddress, coinType: MoveStructId) {
        return await this.aptosClient.getAccountCoinAmount({ accountAddress, coinType });
    }

    get getPackageId() {
        return PACKAGE_ID;
    }


    //check x less than y
    async checkXLessThanY(x: string, y: string) {
        return await this.aptosClient.view({
            payload: this.poolModule.checkXLessThanYData(x, y)
        });
    }

    async checkAddressXLessThanY(x: string, y: string) {
        return await this.aptosClient.view({
            payload: this.poolModule.checkAddressXLessThanYData(x, y)
        });
    }

    async getSwapYPrice(poolId: string, amount: number, a2b: boolean, minimumYAmount: number) {
        return await this.aptosClient.view({
            payload: await this.poolModule.getSwapYPriceData(poolId, amount, a2b, minimumYAmount)
        });
    }
}