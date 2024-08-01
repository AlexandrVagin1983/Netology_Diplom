import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { CommonService } from './common.service';
import { HotelSchema, Hotel } from './schemas/hotel.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
                { name: Hotel.name, schema: HotelSchema }
            ]
        )
    ],
    controllers: [RoomsController],
    providers: [RoomsService, CommonService],
    exports: [RoomsService]
})

export class RoomsModule {}