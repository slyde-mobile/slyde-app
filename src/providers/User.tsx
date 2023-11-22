import ISnsAccount from '../types/snsAccount';


export interface User {
    snsAccount: ISnsAccount | null;
    emailAddress: string | null;
    lastLogin: Date;
    verifier: string | null;
    verifierId: string | null;
    name: string | null;
}
