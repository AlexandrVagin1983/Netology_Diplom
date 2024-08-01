import { Injectable, ConflictException } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        @InjectConnection() private connection: Connection,
    ) {}

    //Добавляет пользователя
    async create(data: Partial<User>): Promise<User> {
        try {
            const user = new this.UserModel(data);
            return await user.save();
        } catch (e) {
            throw new ConflictException(`Ошибка при записи в базу пользователя: ${e.name}. Описание ошибки: ${e.message}`);
         }
    }

    //Возвращает пользовтаеля по id
    async findById(id: string): Promise<UserDocument[]> {
        return await await this.UserModel.findById(id);
    }

     //Возвращает пользователя по email
     async findByEmail(email: string): Promise<UserDocument[]> {
        return await this.UserModel.findOne({'email': email});
    }

    //Возвращает список всех пользователей
    async findAll(): Promise<UserDocument[]> {
        return await this.UserModel.find();
      }
}