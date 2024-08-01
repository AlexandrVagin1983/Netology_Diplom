import { Controller, Get, Post, Put, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';

import { HotelDocument } from './schemas/hotel.schema';
import { RoomDocument } from './schemas/hotelRoom.schema';
import { HydratedDocument, QueryWithHelpers, Schema as MongooseSchema } from 'mongoose';


import {Guard as RoomGuard} from "../guards/Guard.guard";

@Controller('hotel-rooms')
export class RoomsController {
    constructor(private readonly RoomsService: RoomsService) {}
    
     //Основной API для поиска номеров:
     @Get('/:limit /:offset /:hotel')
     async findRooms(@Param('limit') limit: number, @Param('offset') offset: number, @Param('hotel') hotel: MongooseSchema.Types.ObjectId): Promise<RoomDocument[]> {
         return await this.RoomsService.search({limit, offset, hotel});
     }

    //Получение подробной информации о номере:
    @Get(':id')
    async findById(@Param() id: MongooseSchema.Types.ObjectId): Promise<RoomDocument> {
        return await  this.RoomsService.findById(id);
    }
    //Добавление номера гостиницы администратором:
    @UseGuards(RoomGuard)
    @Post()
    async create(@Body() body: RoomDocument): Promise<RoomDocument> {
        return await this.RoomsService.create(body);
    }

    //Изменение описания номера гостиницы администратором:
    @UseGuards(RoomGuard)
    @Put(':id')
    async update(@Param() id: MongooseSchema.Types.ObjectId, @Body() body: RoomDocument): Promise<RoomDocument> {
        return await this.RoomsService.update(id, body);
    }

}