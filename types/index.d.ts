import type { Anoncreds } from '@hyperledger/anoncreds-nodejs';
export {};

declare global{
    interface Error{ 
        status?: number;
    }
}
