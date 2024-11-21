import { AptosConfig, Account, Ed25519PrivateKey, PrivateKey, Hex, CreateEd25519AccountFromPrivateKeyArgs, Ed25519Account, SigningSchemeInput } from "@aptos-labs/ts-sdk";
import dotenv from 'dotenv';
import { PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import { AptosAccount, AptosWallet, HexString } from "@okxweb3/coin-aptos";
dotenv.config();

export class AccountModule extends AptosConfig {

    protected _privateKey;
    protected wallet: AptosWallet;
    protected _publicAddress;
    public account: AptosAccount;

    constructor(privateKey?: string) {
        super();
        this.wallet = new AptosWallet();
        if (!privateKey) {
            this._privateKey = Account.generate().privateKey.toString();
        } else {
            this._privateKey = privateKey;
        }

        // Use asynchronous initialization to ensure account is ready after construction
        this.account = AptosAccount.fromPrivateKey(HexString.ensure(this._privateKey));
        this._publicAddress = this.account.address().toString();

    }


    get privateKey() {
        return this._privateKey;
    }
    getAddress(): string {
        return this._publicAddress;
    }

}
