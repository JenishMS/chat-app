import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { Service } from "typedi";
import { IUser } from '../../user/interface/user.interface';
import { ChatService } from '../services/chat.service';

@JsonController('/chat')
@Service()
@Authorized()
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get('/:userId')
    async getChat(@Param('userId') userId: string, @CurrentUser() user: IUser) {
        return await this.chatService.getChat(userId, user);
    }

    @Post('/send')
    async send(@Body() data: any, @CurrentUser() user: IUser) {
        return await this.chatService.send(data, user);
    }
}