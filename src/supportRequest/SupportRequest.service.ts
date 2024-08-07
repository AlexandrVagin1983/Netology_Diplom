import { Injectable } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestDocument, Message, MessageDocument } from "./schemas/SupportChat.schema";
import { GetChatListParams, SendMessageDto } from './interfaces/dto/SupportRequestDto';


@Injectable()
export class SupportRequestService {
    constructor(
        @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>,
        @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
        @InjectConnection() private connection: Connection,
    ) {}

    //Поиск:
    async findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]> {
        const paramsSearch = {};
        if (params.user) {
            paramsSearch['user'] = params.user;
        }
        if (params.isActive) {
            paramsSearch['isActive'] = params.isActive;
        }
      
        const transaction = this.SupportRequestModel.find(paramsSearch);
      
        if (params.offset) {
            transaction.skip(params.offset);
        }
        if (params.limit) {
            transaction.limit(params.limit);
        }
      
        return transaction.exec();
    }
    //Отправка:
    async sendMessage(data: SendMessageDto): Promise<MessageDocument> {
        
        const Message = new this.MessageModel({...data,sentAt: new Date()});
        const savedMessage = await Message.save();
      
        await this.SupportRequestModel.findByIdAndUpdate(data.supportRequest, {
            $push: { messages: Message._id },
        });
      
        return await savedMessage;
    
    }

    //Получение сообщений:
    async getMessages(id: string): Promise<MessageDocument[]> {
        
        return await this.SupportRequestModel.findById(id);

    }
    
    async findSupportRequestById(id: string): Promise<SupportRequestDocument> {
        return await this.SupportRequestModel.findById(id);
    }

    subscribe(
        handler: (supportRequest: SupportRequestDocument, message: MessageDocument) => void) {
        const supportRequest = this.SupportRequestModel.watch();

        supportRequest.on('change', (change) => {
            if (change.operationType === 'insert') {
            const message = change.fullDocument.messages.pop();

            handler(change.fullDocument, message);
            }
        });
    }
}