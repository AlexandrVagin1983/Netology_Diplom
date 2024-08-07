import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema} from 'mongoose';

export type SupportRequestDocument = SupportRequest & Document;
export type MessageDocument = Message  & Document;

@Schema()
export class SupportRequest {    
    @Prop()
    public _id: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    public user: MongooseSchema.Types.ObjectId;;

    @Prop()
    public createdAt: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message' })
    public messages: Message[];

    @Prop()
    public isActive: boolean;
    
}

@Schema()
export class Message {    
    @Prop()
    public _id: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    public author: MongooseSchema.Types.ObjectId;;

    @Prop()
    public sentAt: Date;

    @Prop()
    public text: string;
    
    @Prop()
    public readAt: Date;
    
}
export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);
