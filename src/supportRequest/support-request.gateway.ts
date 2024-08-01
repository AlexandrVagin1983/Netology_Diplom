import { Server } from 'socket.io';
import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { UserRoles } from 'src/common/decorators/roles.decorator';
import { MessageDocument, SupportRequestDocument } from './schemas/SupportChat.schema';
import { SupportRequestService } from './SupportRequest.service';

@WebSocketGateway({ namespace: 'support-request' })
export class SupportRequestGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly supportRequestService: SupportRequestService) {}

  @SubscribeMessage('subscribeToChat')
  @UserRoles(['client', 'manager'])
  async subscribeToChat(@MessageBody() chatId: string) {
    const handler = (
      supportRequest: SupportRequestDocument,
      message: MessageDocument,
    ) => {
      const supportRequestId = supportRequest._id.toString();
      this.server
        .to(`support-request-${supportRequestId}`)
        .emit('new message', message);
    };

    this.supportRequestService.subscribe(handler);

    this.server.emit(
      'subscription result',
      `You have subscribed to messages from chat ${chatId}`,
    );
  }
}
