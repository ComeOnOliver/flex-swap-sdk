import { AccountModule } from "./modules/accountModule";
import { PoolModule } from "./modules/poolModule";
import { RpcModule } from "./modules/rpcModule";
import { AptosSettings } from "@aptos-labs/ts-sdk";


export class FlexSDK {

    protected _rpcModule: RpcModule
    protected _accountModule: AccountModule
    protected _poolModule: PoolModule
    protected _senderAddress = ''

    constructor(options: AptosSettings, privateKey?: string) {
        this._rpcModule = new RpcModule(options);
        this._accountModule = new AccountModule(privateKey);
        this._poolModule = new PoolModule();
    }

    get senderAddress(): String {
        return this._senderAddress
    }

    set senderAddress(value: string) {
        this._senderAddress = value
    }
    get Account(): AccountModule {
        return this._accountModule
    }

    get getConfig() {
        return { packageId: '11' };
    }
}

const privateKey = process.env.PRIVATE_KEY || '';
const TESTNET_FULLNODE = process.env.TESTNET_FULLNODE || '';
const address = process.env.TEST_ADDRESS || '';
const sdk = new FlexSDK({
    fullnode: TESTNET_FULLNODE,
});

console.log(sdk.Account.privateKey);
console.log(sdk.Account.getAddress());
// const accountnew = sdk.Account.generateAccount;

// console.log(`publicKey: ${accountnew.publicKey.toString()}`);
// console.log(`privateKey: ${accountnew.privateKey.toString()}`);
