import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema} from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {    
    @Prop({ required: true })
    public _id: MongooseSchema.Types.ObjectId;
    
    @Prop({ required: true, unique: true })
    public email: string;

    @Prop()
    public passwordHash: string;

    @Prop()
    public name: string;

    @Prop()
    public contactPhone: string;

    @Prop()
    public role: string;
 
}

export const UserSchema = SchemaFactory.createForClass(User);
