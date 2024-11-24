import { AptosConfig, Account as sdkAccount, PrivateKey, Hex, CreateEd25519AccountFromPrivateKeyArgs, Ed25519Account, SigningSchemeInput } from "@aptos-labs/ts-sdk";
import dotenv from 'dotenv';
import { PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import { AptosAccount, AptosWallet, HexString } from "@okxweb3/coin-aptos";
import { Account, Ed25519PrivateKey } from "@okxweb3/coin-aptos/dist/v2";
dotenv.config();

export class AccountModule extends AptosConfig {

    protected _privateKey;
    public wallet: AptosWallet;
    protected _publicAddress;
    public account: Account;

    constructor(privateKey?: string) {
        super();
        this.wallet = new AptosWallet();
        if (!privateKey) {
            this._privateKey = sdkAccount.generate().privateKey.toStringWithoutPrefix();
            console.log(`new private key generated: ${this._privateKey}`);
        } else {
            this._privateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
        }
        const ed25519PrivateKey = new Ed25519PrivateKey(this._privateKey.slice(0, 64));
        // Use asynchronous initialization to ensure account is ready after construction
        this.account = Account.fromPrivateKey({ privateKey: ed25519PrivateKey });
        this._publicAddress = this.account.accountAddress.toString();
    }

    get privateKey() {
        return this._privateKey;
    }
    get address(): string {
        return this._publicAddress;
    }
}
