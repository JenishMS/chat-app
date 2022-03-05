import { Service } from "typedi";
import { CollectionEnum } from "../../base/enums/collection.enum";
import { BaseService } from "../../base/services/base.service";
import { v4 as uuidv4 } from 'uuid';
import { IChat } from "../interfaces/chat.interface";
import { Authorized } from "routing-controllers";
import { IUser } from "../../user/interface/user.interface";

@Service()
export class ChatService extends BaseService {
    constructor() {
        super(CollectionEnum.CHAT);
    }

    async getChat(userId: string, user: IUser) {
        try {
            let chats = await this.collection.find({
                $or: [
                    {
                        to: userId
                    },
                    {
                        from: user._id
                    },
                    {
                        from: userId
                    },
                    {
                        to: user._id
                    }
                ]
            }).toArray() ?? [];
            return this.success(chats, 'Success');
        } catch (err) {
            return this.error('Failed to get chat');
        }
    }
    
    async send(data: Partial<IChat>, user: IUser) {
        try {
            let response: any = await this.create({...data,_id: uuidv4(), createdAt: new Date(), from: user._id});
            if(response) {
                let chat = await this.getById(response.insertedId);              
                return this.success(chat, 'Success');
            }
            return this.error('Failed to send message');
        } catch (err) {
            return this.error('Failed to get chat');
        }
    }
}