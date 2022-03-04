import { Service } from "typedi";
import { CollectionEnum } from "../../base/enums/collection.enum";
import { BaseService } from "../../base/services/base.service";
import { v4 as uuidv4 } from 'uuid';
import { IChat } from "../interfaces/chat.interface";
import { Authorized } from "routing-controllers";

@Service()
export class ChatService extends BaseService {
    constructor() {
        super(CollectionEnum.CHAT);
    }

    async getChat(userId: string) {
        try {
            let chats = await this.collection.find({
                $or: [{
                    from: userId
                }, {to: userId}]
            }).toArray() ?? [];
            return this.success(chats, 'Success');
        } catch (err) {
            return this.error('Failed to get chat');
        }
    }
    
    async send(data: Partial<IChat>) {
        try {
            let response = await this.create({...data,_id: uuidv4(), createdAt: new Date()});
            if(response) {
                return this.success({}, 'Success');
            }
            return this.error('Failed to send message');
        } catch (err) {
            return this.error('Failed to get chat');
        }
    }
}