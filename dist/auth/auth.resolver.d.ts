import { AuthService } from '@auth/auth.service';
import { Response } from 'express';
import { User } from "@app/auth/user.schema";
interface GqlContext {
    res: Response;
    req: any;
}
declare class AuthPayload {
    message: string;
    username: string;
}
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    login(username: string, password: string, context: GqlContext): Promise<AuthPayload>;
    logout(context: GqlContext): Promise<string>;
    healthCheck(context: GqlContext): Promise<User>;
}
export {};
