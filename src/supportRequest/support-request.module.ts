import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'

import { SupportRequest, SupportRequestSchema } from './schemas/SupportChat.schema'
import { SupportRequestApiController } from './support-request.controller';
import { SupportRequestGateway } from './support-request.gateway';
import { Message } from './schemas/SupportChat.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: SupportRequest.name, schema: SupportRequestSchema },{ name: Message.name, schema: Message }])],
  providers: [SupportRequestGateway],
  controllers: [SupportRequestApiController],
})
export class SupportRequestApiModule {}
