//import { Controller, Get, Post, Put, Param, Delete, Body } from '@nestjs/common';
import {Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {JwtAuthGuard} from "./jwt.auth.guard";
import { UsersService } from '../users/users.service';
import { User, UserDocument } from "../users/schemas/user.schema";

import { HydratedDocument, QueryWithHelpers, Schema as MongooseSchema } from 'mongoose';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService, private readonly UsersService: UsersService) {}

    @Get('/token')
    getToken(): string {
      return this.AuthService.createToken({ id: 2 });
    }
    
    //Вход
    @UseGuards(JwtAuthGuard)
    @Post('/login')
    async login(@Request() req) {
        const { email, name, contactPhone } = req.session.passport.user
        return { email, name, contactPhone }
    }

    //Выход
    @UseGuards(JwtAuthGuard)
    @Post('/logout')
    async logout(@Request() req) {
        return null;
    }

    //Регистрация
    @UseGuards(JwtAuthGuard)
    @Post('/register')
    async register(@Request() req) {
        return this.UsersService.create(req);
    }
}