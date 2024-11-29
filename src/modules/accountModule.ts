import { AptosConfig, Account, PrivateKey, Hex, CreateEd25519AccountFromPrivateKeyArgs, Ed25519Account, SigningSchemeInput, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import dotenv from 'dotenv';
import { PrivateKeyVariants } from "@aptos-labs/ts-sdk";

dotenv.config();

export class AccountModule extends AptosConfig {

    protected _privateKey;
    protected _publicAddress;
    public account: Account;

    constructor(privateKey?: string, address?: string) {
        super();
        if (!privateKey) {
            this._privateKey = Account.generate().privateKey.toStringWithoutPrefix();
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
