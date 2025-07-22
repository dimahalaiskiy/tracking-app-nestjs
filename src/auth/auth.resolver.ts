import { Resolver, Mutation, Args, Context, ObjectType, Field, Query } from '@nestjs/graphql';
import { AuthService } from '@auth/auth.service';
import { Response } from 'express';
import { User } from "@app/auth/user.schema";

interface GqlContext {
  res: Response;
  req: any;
}

@ObjectType()
class AuthPayload {
  @Field()
  message: string;

  @Field()
  username: string;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Context() context: GqlContext,
  ): Promise<AuthPayload> {
    const result = await this.authService.loginOrCreate(username, password);

    if (result && result.sessionId) {
      context.res.cookie('session_id', result.sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      
      return { message: 'Logged in', username: result.user.username };
    }

    throw new Error('Invalid credentials');
  }

  @Mutation(() => String)
  async logout(@Context() context: GqlContext): Promise<string> {
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

  @Query(() => User)
  async healthCheck(@Context() context: GqlContext): Promise<User> {
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
}
