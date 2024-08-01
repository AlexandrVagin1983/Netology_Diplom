import { Controller, Get, Post, Put, Param, Delete, Body, UseGuards, Query, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {  Schema as MongooseSchema } from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express/multer';


import { HotelsService } from './hotels.service';
import { RoomsService } from './rooms.service';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { HotelRoom } from './schemas/hotelRoom.schema';

import { SearchHotelParams, UpdateHotelParams } from './interfaces/hotel.interface';
import { SearchRoomsParams } from './interfaces/hotelRoom.interface';

import {Guard as HotelGuard} from "../guards/Guard.guard";

@Controller()
export class HotelsController {
    constructor(
        private readonly HotelsService: HotelsService,
        private readonly HotelRoomService: RoomsService
    ) {}
    
    //Основной API для поиска номеров.
    @Get('common/hotel-rooms')
    async getHotelRooms(@Query() query: SearchRoomsParams) {

      return await this.HotelRoomService.search(query);
    }

    //Информация о конкретном номере
    @Get('common/hotel-rooms/:id')
    async getHotelRoom(@Param('id') id: MongooseSchema.Types.ObjectId) {
        return await this.HotelRoomService.findById(id);
    }
    //Добавление гостиницы администратором:
    @UseGuards(HotelGuard)
    @Post('admin/hotels')
    async createHotel(@Body() data: Hotel): Promise<HotelDocument> {
      return await this.HotelsService.create(data);
    }
    
    //Получение списка гостиниц администратором:
    @UseGuards(HotelGuard)
    @Get('admin/hotels')
    async getHotels(@Query() params: SearchHotelParams): Promise<Hotel[]> {
        return await this.HotelsService.search(params);
    }

    //Изменение описания гостиницы администратором:
    @Put('admin/hotels/:id')
    @UseGuards(HotelGuard)
    public update(
        @Param() id: MongooseSchema.Types.ObjectId, @Body() data: UpdateHotelParams) {
        return this.HotelsService.update(id, data);
    }

    //Добавление номера администратором:
    @Put('admin/hotel-rooms/:id')
    @UseGuards(HotelGuard)
    @UseInterceptors(FilesInterceptor('images', 10))
    async createHotelRoom(
        @Param('id') roomId: MongooseSchema.Types.ObjectId
        , @Body() data: HotelRoom,
        @UploadedFiles() files: Array<Express.Multer.File>
        ) {
        data.images = files.map((file) => file.originalname)

        return await this.HotelRoomService.create(data)
    }

    //Изменение описания номера администратором
    @Put('hotel-rooms/:id')
    @UseGuards(HotelGuard)
    @UseInterceptors(FilesInterceptor('images', 10))
    updateHotelRoom(
        @Param('id') id: MongooseSchema.Types.ObjectId,
        @Body() data: HotelRoom,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
    if (files) data.images = files.map((file) => file.originalname)
    return this.HotelRoomService.update(id, data)
  }

}