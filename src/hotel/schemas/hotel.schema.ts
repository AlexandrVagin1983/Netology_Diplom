import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { timestamps } from 'mongoose-timestamp';

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel {    
    @Prop({ required: true })
    public _id: MongooseSchema.Types.ObjectId;
    
    @Prop({ required: true, unique: true })
    public title: string;

    @Prop({ required: true })
    public description: string;

    @Prop({ required: true })
    public createdAt: Date;

    @Prop({ required: true })
    public updatedAt: Date;

}

export const HotelSchema = SchemaFactory.createForClass(Hotel).plugin(timestamps, {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    });
