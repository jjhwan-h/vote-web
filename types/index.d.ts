
import IAdmin from '../models/admin';
import IUser from '../models/user';

export {};

declare global{
    interface Error{ 
        status?: number;
    }
    namespace Express{
        interface User extends IAdmin {}
    }

}
declare module "express-session" {
    export interface SessionData {
        email: string,
        token: string,
    }
}

