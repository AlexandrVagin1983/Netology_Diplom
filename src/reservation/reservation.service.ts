import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model, Connection, Document, HydratedDocument, QueryWithHelpers } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Reservation, ReservationDocument } from "./schemas/reservation.schema";
import { ReservationDto, ReservationSearchOptions } from './interfaces/reservation.interface';


@Injectable()
export class ReservationsService {
    constructor(
        @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
        @InjectConnection() private connection: Connection,
    ) {}

    //Добавляет новую бронь
    async addReservation(data: ReservationDto): Promise<ReservationDocument> {
        const reservations = await this.ReservationModel.find({ roomId: data.roomId })
        if (reservations) {
            const ds = new Date(data.dateStart)
            const de = new Date(data.dateEnd)
            if (
                reservations.find(
                    (res: ReservationDocument) =>
                    (ds <= new Date(res.dateStart) && de >= new Date(res.dateEnd)) ||
                    (ds <= new Date(res.dateEnd) && de >= new Date(res.dateEnd)) ||
                    (ds <= new Date(res.dateStart) && de >= new Date(res.dateStart))
                )
            )  return null
        }
        return new this.ReservationModel(data).save()
    }
     //удаляет бронь:
    async removeReservation(id: string): Promise<void> {
        await this.ReservationModel.findByIdAndDelete(id);
    }

    //Возвращает массив броней
    async getReservations(data: ReservationSearchOptions): Promise<ReservationDocument[]> {
        return await this.ReservationModel.find(data).exec();
    }
   
}