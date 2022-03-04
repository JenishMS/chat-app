import { Authorized, Body, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { Service } from "typedi";
import { ChatService } from '../services/chat.service';

@JsonController('/chat')
@Service()
@Authorized()
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get('/:userId')
    async getChat(@Param('userId') userId: string) {
        return await this.chatService.getChat(userId);
    }

    @Post('/send')
    async send(@Body() data: any) {
        return await this.chatService.send(data);
    }
}