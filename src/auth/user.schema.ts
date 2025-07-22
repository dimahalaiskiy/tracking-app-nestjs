import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class User extends Document {
  @Field()
  @Prop({ required: true, unique: true })
  username: string;

  @Field()
  @Prop({ required: true })
  password: string;

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  sessions: string[];

  @Field({ nullable: true })
  @Prop({ type: Date, default: null })
  lastInteraction: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
