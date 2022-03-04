import { Body, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { Service } from "typedi";
import { ApiResponse } from '../../base/interfaces/api-response.interface';
import { ILoginRequest } from '../interfaces/login-request.interface';
import { ISignupRequest } from '../interfaces/signup-request.interface';
import { AuthService } from '../services/auth.service';

@JsonController('/auth')
@Service()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signUp(@Body() data: ISignupRequest) {
        const result = await this.authService.signUp(data);
        return await result;
    }

    @Post('/signin')
    async signIn(@Body() data: ILoginRequest) {
        const result = await this.authService.signIn(data);
        return await result;
    }
}