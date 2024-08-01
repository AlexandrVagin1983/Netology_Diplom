import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken'
import {config} from 'config'

const JWT_SECRET: string = config.get('jwt.jwt_secret');

@Injectable()
export class Guard implements CanActivate {
    constructor(private readonly reflector: Reflector) { 
        
    }
    canActivate( context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const currentRouteRole = this.reflector.get<string>('role', context.getHandler());
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;
        const token = authorization.replace(/Bearer /, '');
        const payload = jwt.verify(token, JWT_SECRET);
        if (currentRouteRole && !payload.includes(currentRouteRole)) {
        throw new ForbiddenException();
        }
        request.user = payload;
        return true;
    }
}