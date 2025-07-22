import { Model } from 'mongoose';
import { User } from '@auth/user.schema';
export declare class AuthService {
    private userModel;
    constructor(userModel: Model<User>);
    validateUser(username: string, password: string): Promise<boolean>;
    loginOrCreate(username: string, password: string): Promise<{
        user: User;
        sessionId: string;
    }>;
    removeSession(username: string, sessionId: string): Promise<void>;
}
