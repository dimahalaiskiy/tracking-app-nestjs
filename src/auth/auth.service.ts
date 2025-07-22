import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@auth/user.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.userModel.findOne({ username, password }).exec();
    return !!user;
  }

  async loginOrCreate(username: string, password: string): Promise<{ user: User; sessionId: string }> {
    let user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      user = new this.userModel({ username, password, sessions: [] });
      await user.save();
    }

    const sessionId = randomUUID();
    user.sessions.push(sessionId);
    await user.save();

    return { user, sessionId };
  }

  async removeSession(username: string, sessionId: string): Promise<void> {
    await this.userModel.updateOne(
      { username },
      { $pull: { sessions: sessionId } }
    ).exec();
  }
}
