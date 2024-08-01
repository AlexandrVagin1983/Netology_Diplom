import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document} from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel {    
    @Prop({ required: true })
    public _id: MongooseSchema.Types.ObjectId;
    
    @Prop({ required: true })
    public title: string;

    @Prop()
    public description: string;

    @Prop()
    public createdAt: Date;

    @Prop()
    public updatedAt: Date;

}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
