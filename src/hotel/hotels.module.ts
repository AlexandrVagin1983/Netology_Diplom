import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { CommonService } from './common.service';
import { HotelSchema, Hotel } from './schemas/hotel.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { join } from 'path';
import { directory } from 'src/common/constants'

@Module({
    imports: [
        MongooseModule.forFeature([
                { name: Hotel.name, schema: HotelSchema }
            ]
        ),
        MulterModule.register({
            storage: diskStorage({
              destination: join(directory, 'upload')
            }),
          })
    ],
    controllers: [HotelsController],
    providers: [HotelsService, CommonService],
    exports: [HotelsService]
})

export class HotelsModule {}