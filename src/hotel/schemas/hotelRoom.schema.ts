import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

import { Hotel } from './hotel.schema';

export type RoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
    @Prop()
    _id: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Hotel', required: true })
    hotel: Hotel;

    @Prop()
    description: string;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ required: true })
    createdAt: Date;

    @Prop({ required: true })
    updatedAt: Date;
    
    @Prop({ required: true, default: true })
    isEnabled: Boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
