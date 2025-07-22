"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_service_1 = require("./auth.service");
const user_schema_1 = require("./user.schema");
let AuthPayload = class AuthPayload {
    message;
    username;
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthPayload.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthPayload.prototype, "username", void 0);
AuthPayload = __decorate([
    (0, graphql_1.ObjectType)()
], AuthPayload);
let AuthResolver = class AuthResolver {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(username, password, context) {
        const result = await this.authService.loginOrCreate(username, password);
        if (result && result.sessionId) {
            context.res.cookie('session_id', result.sessionId, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
            return { message: 'Logged in', username: result.user.username };
        }
        throw new Error('Invalid credentials');
    }
    async logout(context) {
        const cookies = context.req.cookies;
        const sessionId = cookies?.session_id;
        if (sessionId) {
            const user = await this.authService['userModel'].findOne({ sessions: sessionId });
            if (user) {
                await this.authService.removeSession(user.username, sessionId);
            }
        }
        context.res.clearCookie('session_id');
        return 'Logged out';
    }
    async healthCheck(context) {
        const cookies = context.req.cookies;
        const sessionId = cookies?.session_id;
        if (!sessionId) {
            throw new Error('Unauthorized: No session');
        }
        const user = await this.authService['userModel'].findOne({ sessions: sessionId });
        if (!user) {
            throw new Error('Unauthorized: Invalid session');
        }
        return user;
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Mutation)(() => AuthPayload),
    __param(0, (0, graphql_1.Args)('username')),
    __param(1, (0, graphql_1.Args)('password')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logout", null);
__decorate([
    (0, graphql_1.Query)(() => user_schema_1.User),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "healthCheck", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map