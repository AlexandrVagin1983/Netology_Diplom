import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CommonService } from '../hotel/common.service';
import { UserSchema, User } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
                { name: User.name, schema: UserSchema }
            ]
        )
    ],
    controllers: [UsersController],
    providers: [UsersService, CommonService],
    exports: [UsersService]
})

export class UsersModule {}