import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ virtuals: true })
    id: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toObject', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id.toHexString();
        delete ret._id;
    },
});
