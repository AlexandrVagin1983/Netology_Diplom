import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common'
import {Schema as MongooseSchema} from 'mongoose';
import { UserRoles as Roles } from  'src/common/decorators/roles.decorator'
import { ReservationDto, ReservationSearchOptions } from './interfaces/reservation.interface'
import { ReservationsService } from './reservation.service'
import { Reservation } from './schemas/reservation.schema'
import { isEnabledFlag, CurrentUser as User } from 'src/common/decorators/current-user.decorator'
import { RoomsService } from 'src/hotel/rooms.service'
import { HttpException } from '@nestjs/common'

@Controller('client')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly hotelRoomService: RoomsService
  ) {}

  //Создаёт бронь на номер на выбранную дату для текущего пользователя.
  @Roles(['client'])
  @Post('reservations')
  async addReservation(@Body() data: ReservationDto, @User() user, @isEnabledFlag() flag: true) {
    const room = await this.hotelRoomService.findById(data.roomId)
    if (!room) throw new HttpException('Номер не найден', 400)

    const reservationData = { ...data, user: user._id, hotel: room.hotel._id }
    const reservation = await this.reservationsService.addReservation(reservationData)
    if (!reservation) throw new HttpException('Номер занят', 400)

    return {
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      hotelRoom: { description: room.description, images: room.images },
      hotel: room.hotel
    }
  }

  //Список броней текущего пользователя.
  @Roles(['client'])
  @Get('reservations')
  getReservations(@Query() filter: ReservationSearchOptions): Promise<Reservation[]> {
    return this.reservationsService.getReservations(filter)
  }

  //Отменяет бронь пользователя.
  @Roles(['client'])
  @Delete('reservations/:id')
  removeReservation(@Param('id') id: string, @User() user) {
    return this.reservationsService.removeReservation(id)
  }
}

@Controller('manager')
export class ReservationsManagerController {
  constructor(private readonly reservationsService: ReservationsService) {}

  //Список броней конкретного пользователя
  @Roles(['manager'])
  @Get('reservations/:userId')
  getReservations(@Param('userId') id: MongooseSchema.Types.ObjectId, @Query() filter: ReservationSearchOptions): Promise<Reservation[]> {
      filter.userId = id;
      return this.reservationsService.getReservations(filter);
  }

  //Отмена бронирования менеджером
  @Roles(['manager'])
  @Delete('reservations/:reservationId')
  removeReservation(@Param('reservationId') id: string) {
    return this.reservationsService.removeReservation(id)
  }
}
