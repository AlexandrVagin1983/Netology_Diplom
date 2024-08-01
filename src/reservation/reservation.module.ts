import { Module } from '@nestjs/common';

import { HotelsModule } from 'src/hotel/hotels.module';

import { ReservationsController, ReservationsManagerController } from './reservation.controller';
import { ReservationsService } from './reservation.service';

@Module({
  imports: [HotelsModule],
  controllers: [ReservationsController, ReservationsManagerController],
  providers: [ReservationsService],
})
export class ReservationApiModule {}
