import { Authorized, Body, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { Service } from "typedi";
import { UserService } from '../services/user.service';

@JsonController('/user')
@Service()
@Authorized()
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/all')
    async getAllUsers() {
        return await this.userService.getAllUsers()
    }

    @Get('/:userId')
    async getUser(@Param('userId') userId: string) {
        return await this.userService.getUser(userId);
    }

    @Get('/search/:searchText')
    async searchUser(@Param('searchText') searchText: string) {
        return await this.userService.searchUser(searchText);
    }
}