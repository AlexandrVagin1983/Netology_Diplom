import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model, Connection, Schema as MongooseSchema } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { SearchRoomsParams } from "./interfaces/hotelRoom.interface";
import { HotelRoom, RoomDocument } from "./schemas/hotelRoom.schema";

@Injectable()
export class RoomsService {
    constructor(
        @InjectModel(HotelRoom.name) private RoomModel: Model<RoomDocument>,
        @InjectConnection() private connection: Connection,
    ) {}

    //Добавляет новый номер
    async create(data: HotelRoom): Promise<RoomDocument> {
        const { hotel, description, images } = data;
        const hotelRoom = await new this.RoomModel(data).save();
        return await hotelRoom.populate('hotel');
    }

    //Обновляет данные о номере
    async update(id: MongooseSchema.Types.ObjectId, data: Partial<HotelRoom>): Promise<RoomDocument> {
        return this.RoomModel.findByIdAndUpdate(id, data).exec()
    }

    //Поиск номера по ID:
    async findById(id: MongooseSchema.Types.ObjectId): Promise<RoomDocument> {
        const room = await this.RoomModel.findById(id);
        return room;
    }
    
    //Поиск номеров по отелю
    async search(params: SearchRoomsParams): Promise<RoomDocument[]> {
        return await this.RoomModel.find({hotel: params.hotel}).skip(params.offset).limit(params.limit).exec();
    }
}