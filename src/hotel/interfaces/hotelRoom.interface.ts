import {Schema as MongooseSchema} from 'mongoose';
import { Hotel } from '../schemas/hotel.schema'
import { HotelRoom } from '../schemas/hotelRoom.schema'

  export interface SearchRoomsParams {
    limit: number;
    offset: number;
    hotel: MongooseSchema.Types.ObjectId;
    isEnabled?: boolean;
  }
  

  export interface HotelRoomService {
    create(data: Partial<HotelRoom>): Promise<HotelRoom>;
    findById(id: MongooseSchema.Types.ObjectId): Promise<HotelRoom>;
    search(params: SearchRoomsParams): Promise<HotelRoom[]>;
    update(id: MongooseSchema.Types.ObjectId, data: Partial<HotelRoom>): Promise<HotelRoom>;
  }