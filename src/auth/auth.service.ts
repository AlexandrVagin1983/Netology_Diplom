import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(id: string): Promise<any> {
        const user = await this.usersService.findById(id);
        if (user) {
            return user;
        }
        return null;
    }

    createToken(payload: any) {
        return this.jwtService.sign(payload);
    }
}