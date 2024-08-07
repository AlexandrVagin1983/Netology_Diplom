import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from 'src/users/schemas/user.schema';
import {Schema as MongooseSchema} from 'mongoose';

import { SupportRequest, Message } from "./schemas/SupportChat.schema";
import { ISupportRequestClientService, CreateSupportRequestDto } from './interfaces/dto/SupportRequestDto';

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  //Создание
  async createSupportRequest(
    data: CreateSupportRequestDto & { user: MongooseSchema.Types.ObjectId },
  ): Promise<SupportRequest> {
    const newMessage = await this.messageModel.create({
      author: data.user,
      sentAt: new Date(),
      text: data.text,
      readAt: null,
    });

    const request = await this.supportRequestModel.create({
      user: data.user,
      isActive: true,
      hasNewMessages: true,
      messages: [newMessage._id],
      createdAt: new Date(),
    });

    return await request.save();
  }

  //Отметка о прочтении
  async markMessagesAsRead({user, supportRequest, createdBefore}: any) {
    const supportRequestDocument = await this.supportRequestModel.findById(supportRequest);
    const messageIds = supportRequestDocument.get('messages');

    return await this.messageModel.updateMany({_id: { $in: messageIds }, author: { $ne: user }, sentAt: { $lte: createdBefore }}, { $set: { readAt: new Date() } });
  }

  //Получение непрочитанных
  async getUnreadCount(supportRequest: string): Promise<number> {
    const managers = await this.userModel.find({ role: 'manager' }).exec();

    const messagesCount = await this.messageModel
      .countDocuments({
        author: { $in: [managers] },
        supportRequest,
        isRead: false,
      })
      .exec();

    return messagesCount;
  }
}
