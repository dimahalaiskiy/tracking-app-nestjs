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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async validateUser(username, password) {
        const user = await this.userModel.findOne({ username, password }).exec();
        return !!user;
    }
    async loginOrCreate(username, password) {
        let user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            user = new this.userModel({ username, password, sessions: [] });
            await user.save();
        }
        const sessionId = (0, crypto_1.randomUUID)();
        user.sessions.push(sessionId);
        await user.save();
        return { user, sessionId };
    }
    async removeSession(username, sessionId) {
        await this.userModel.updateOne({ username }, { $pull: { sessions: sessionId } }).exec();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map