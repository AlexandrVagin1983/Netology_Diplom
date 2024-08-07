import { Body, Controller, ForbiddenException, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRoles } from 'src/common/decorators/roles.decorator';

import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { SupportRequestService } from './SupportRequest.service';
import { CreateSupportRequestDto, GetChatListParams, SendMessageDto, MarkMessagesAsReadDto } from './interfaces/dto/SupportRequestDto';
import {Guard as SupportGuard} from "../guards/Guard.guard";


@Controller()
export class SupportRequestApiController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  //создать обращение в техподдержку
  @UseGuards(SupportGuard)
  @Post('client/support-requests')
  async createSupportRequest(
    @Body() body: CreateSupportRequestDto,
    @CurrentUser() user,
  ) {
    return await this.supportRequestClientService.createSupportRequest({...body, user: user._id });
  }

  //Получение списка обращений в поддержку для клиента
  @Get('client/support-requests')
  async getClientSupportRequests(
    @CurrentUser() user,
    @Query() params: GetChatListParams,
  ) {
    const requests = await this.supportRequestService.findSupportRequests({
      ...params,
      user: user._id,
    });

    return requests;
  }

  //Получение списка обращений в поддержку для менеджера
  @Get('manager/support-requests')
    async getSupportRequests(@Query() params: GetChatListParams) {
    return await this.supportRequestService.findSupportRequests({
      ...params,
    });
  }

  //Получение истории сообщений из обращения в техподдержку
  @Get('common/support-requests/:id/messages')
  @UserRoles(['client', 'manager'])
  async getSupportRequestsMessages(@Param('id') id: string) {
    return await this.supportRequestService.getMessages(id);
  }

  //Позволяет пользователю с ролью manager или client отправлять сообщения в чат.
  @Post('common/support-requests/:id/messages')
  @UserRoles(['client', 'manager'])
  async sendMessage(
    @Param('id') id: string,
    @CurrentUser() user,
    @Body() body: SendMessageDto,
  ) {
    return await this.supportRequestService.sendMessage({
      supportRequest: id,
      ...body,
      author: user._id,
    });
  }

  //Отправка события, что сообщения прочитаны
  @Post('common/support-requests/:id/messages/read')
  @UserRoles(['client', 'manager'])
  async markRead(
    @Param('id') supportRequest: string,
    @CurrentUser() user,
    @Body() body: MarkMessagesAsReadDto,
  ) {
    const params = {
      user,
      supportRequest,
      createdBefore: new Date(body.createdBefore),
    };

    if (user.role == 'managet') {
      return await this.supportRequestEmployeeService.markMessagesAsRead(
        params,
      );
    } else if (user.role == 'client') {
      const supportRequestDocument =
        await this.supportRequestService.findSupportRequestById(supportRequest);
      const userMatch =
        supportRequestDocument.user.toString() != user._id.toString();

      if (userMatch) {
        throw new ForbiddenException('Недостаточно прав для выполнения данного действия.');
      }

      return await this.supportRequestClientService.markMessagesAsRead({
        ...params,
        user: user._id,
      });
    }
  }
}
