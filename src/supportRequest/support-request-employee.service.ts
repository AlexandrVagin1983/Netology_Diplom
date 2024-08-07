import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Schema as MongooseSchema} from 'mongoose';

import { USER_ROLE } from 'config/userRoles';

import { User } from 'src/users/schemas/user.schema';
import { SupportRequest, Message } from "./schemas/SupportChat.schema";
import { ISupportRequestEmployeeService } from './interfaces/dto/SupportRequestDto';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async markMessagesAsRead(params: any) {
    const supportRequestDocument =
      await this.supportRequestModel.findById(params.supportRequest);
    const messageIds = supportRequestDocument.get('messages');

    const managerUsers = await this.userModel
      .find({ role: USER_ROLE.MANAGER })
      .select('_id');

    return await this.messageModel
      .updateMany(
        {
          _id: { $in: messageIds },
          author: { $nin: managerUsers },
          sentAt: { $lte: new Date },
        },
        { $set: { readAt: new Date() } },
      )
      .exec();
  }

  async getUnreadCount(supportRequest: MongooseSchema.Types.ObjectId): Promise<number> {
    const user = await this.supportRequestModel
      .findById(supportRequest)
      .get('user');

    const count = await this.messageModel
      .countDocuments({
        supportRequest,
        user,
        isRead: false,
      })
      .exec();

    return count;
  }

  async closeRequest(supportRequestId: MongooseSchema.Types.ObjectId): Promise<void> {
    await this.supportRequestModel.updateOne(
      {
        _id: supportRequestId,
      },
      {
        isActive: false,
      },
    );
  }
}
