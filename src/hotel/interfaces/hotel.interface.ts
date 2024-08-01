import {Schema as MongooseSchema} from 'mongoose';
import { Hotel } from '../schemas/hotel.schema'
import { HotelRoom } from '../schemas/hotelRoom.schema'

export interface SearchHotelParams {
    limit: number;
    offset: number;
    title: string;
  }

  export interface UpdateHotelParams {
    title: string;
    description: string;
  }

  export interface IHotelService {
    create(data: any): Promise<Hotel>;
    findById(id: MongooseSchema.Types.ObjectId): Promise<Hotel>;
    search(params: SearchHotelParams): Promise<Hotel[]>;
    update(id: MongooseSchema.Types.ObjectId, data: UpdateHotelParams): Promise<Hotel>;
  }

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