import { Injectable } from '@nestjs/common';
import { Model, Connection, Schema as MongooseSchema } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from "./schemas/hotel.schema";
import { SearchHotelParams, UpdateHotelParams, IHotelService } from './interfaces/hotel.interface';

@Injectable()
export class HotelsService {
    constructor(
        @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
        @InjectConnection() private connection: Connection,
    ) {}

    //Добавляет новый отель
    async create(data: any): Promise<HotelDocument> {
        const hotel = new this.HotelModel(data);
        hotel.createdAt = new Date();
        hotel.updatedAt = hotel.createdAt;
        return await hotel.save();
    }

    //Возвращает отель по id
    async findById(id: MongooseSchema.Types.ObjectId): Promise<[HotelDocument]> {         
        return await this.HotelModel.findById(id);
    }

    //Поиск отелей:
    async search(params: SearchHotelParams): Promise<Hotel[]> {
        
        return await this.HotelModel.find().skip(params.offset).limit(params.limit);
    }

    //Обновляет отель по айди
    async update(id: MongooseSchema.Types.ObjectId, data: UpdateHotelParams): Promise<HotelDocument> {
        return await this.HotelModel.findOneAndUpdate(
            { _id: id },
            data,
        );
    }
}