import {Schema as MongooseSchema} from 'mongoose';
import { User } from "src/users/schemas/user.schema";

export interface SearchUserParams {
    limit: number
    offset: number
    email: string
    name: string
    contactPhone: string
  }

export interface IUserService {
    create(data: Partial<User>): Promise<User>
    findById(id: MongooseSchema.Types.ObjectId): Promise<User>
    findByEmail(email: string): Promise<User>
    findAll(params: SearchUserParams): Promise<User[]>
  }