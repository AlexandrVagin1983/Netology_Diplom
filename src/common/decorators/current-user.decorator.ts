import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserDocument } from 'src/users/schemas/user.schema'

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);


export const isEnabledFlag = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return !request.isAuthenticated() || request.user.role === 'client' ? true : false
});