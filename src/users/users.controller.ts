import { Controller, Get, Post, Put, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';


import { User, UserDocument } from './schemas/user.schema';
import { HydratedDocument, QueryWithHelpers, Schema as MongooseSchema } from 'mongoose';

import { SearchUserParams } from './interfaces/user.interface';

import {Guard as UserGuard} from "../guards/Guard.guard";

@Controller()
export class UsersController {
    constructor(private readonly UserService: UsersService) {}
    
    //Создание пользователя:
    @UseGuards(UserGuard)
     @Post('admin/users')
    public create(@Body() body: User): Promise<User> {
        const user = this.UserService.create(body);       
        return user;
    }
    
    //Получение списка пользователей:
    @UseGuards(UserGuard)
    @Get('admin/users')
    public getAllUsers(): Promise<UserDocument[]> {
        return this.UserService.findAll();
    }

}

