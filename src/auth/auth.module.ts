import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from '@auth/auth.service';
import { AuthResolver } from '@auth/auth.resolver';
import { User, UserSchema } from '@auth/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
