import {Schema as MongooseSchema} from 'mongoose';

import { SupportRequest, Message } from 'src/supportRequest/schemas/SupportChat.schema'

export interface CreateSupportRequestDto  {
    user: MongooseSchema.Types.ObjectId;
    text: string;
}

export interface SendMessageDto {
    author: MongooseSchema.Types.ObjectId;
    supportRequest: MongooseSchema.Types.ObjectId;
    text: String;
}

export interface MarkMessagesAsReadDto {
    user: MongooseSchema.Types.ObjectId;
    supportRequest: MongooseSchema.Types.ObjectId;
    createdBefore: Date;
}

export interface GetChatListParams  {
    user: MongooseSchema.Types.ObjectId | null;
    isActive: boolean;
    offset: number;
    limit: number;
}

export interface ISupportRequestService {
    findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>
    sendMessage(data: SendMessageDto): Promise<Message>
    getMessages(supportRequest: MongooseSchema.Types.ObjectId): Promise<Message[]>
  }
  
  export interface ISupportRequestClientService {
    createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>
    markMessagesAsRead(params: MarkMessagesAsReadDto)
    getUnreadCount(supportRequest: string): Promise<number>
  }
  
  export interface ISupportRequestEmployeeService {
    markMessagesAsRead(params: MarkMessagesAsReadDto);
    getUnreadCount(supportRequest: MongooseSchema.Types.ObjectId): Promise<number>;
    closeRequest(supportRequest: MongooseSchema.Types.ObjectId): Promise<void>;
  }