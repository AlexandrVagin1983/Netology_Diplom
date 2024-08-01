import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Schema as MongooseSchema} from 'mongoose';
 
import { Hotel }      from "src/hotel/schemas/hotel.schema";
import { User }       from "src/users/schemas/user.schema";
import { HotelRoom }  from "src/hotel/schemas/hotelRoom.schema";

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {    
    @Prop()
    _id: MongooseSchema.Types.ObjectId;

    
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: User;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Hotel', required: true })
    hotelId: Hotel;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'HotelRoom', required: true })
    roomId: HotelRoom;

    @Prop()
    dateStart: Date;

    @Prop()
    dateEnd: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Reservation);
