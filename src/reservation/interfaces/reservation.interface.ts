import {Schema as MongooseSchema} from 'mongoose';
import {Reservation} from '../schemas/reservation.schema';

export interface ReservationDto {
    userID: MongooseSchema.Types.ObjectId
    hotelId: MongooseSchema.Types.ObjectId
    roomId: MongooseSchema.Types.ObjectId
    dateStart: Date
    dateEnd: Date
  }
  export interface ReservationSearchOptions {
    userId: MongooseSchema.Types.ObjectId
    dateStart: Date
    dateEnd: Date
  }
  
  export interface IReservation {
    addReservation(data: ReservationDto): Promise<Reservation>
    removeReservation(id: MongooseSchema.Types.ObjectId): Promise<void>
    getReservations(filter: ReservationSearchOptions): Promise<Array<Reservation>>
  }