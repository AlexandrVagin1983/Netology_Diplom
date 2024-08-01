import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const UserRoles = (roles: string[]): CustomDecorator =>
  SetMetadata('userRoles', roles);