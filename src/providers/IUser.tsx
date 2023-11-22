import SolanaRpc from "../util/solanaRPC";
import { User } from "./User";

export interface IUser {
    toUser(rpc: SolanaRpc): Promise<User>;
    sns: string | null;
    emailAddress: string | null;
    account: string;
    verifier: string | null;
    verifierId: string | null;
    name: string | null;
    lastLogin: Date;
}

export class IUserImpl implements IUser {
    sns: string | null;
    emailAddress: string | null;
    account: string;    
    verifier: string | null;
    verifierId: string | null;
    name: string | null;
    lastLogin: Date;

    constructor(user: IUser) {
        this.sns = user.sns;
        this.emailAddress = user.emailAddress;
        this.account = user.account;
        this.verifier = user.verifier;
        this.verifierId = user.verifierId;
        this.lastLogin = user.lastLogin;
        this.name = user.name;
    }

    async toUser(rpc: SolanaRpc): Promise<User> {
        return {
            snsAccount: this.sns ? await rpc.getSnsAccountForSubdomain(this.sns) : null,
            emailAddress: this.emailAddress,
            lastLogin: this.lastLogin,
            verifier: this.verifier,
            verifierId: this.verifierId,
            name: this.name,
        };
    }
}