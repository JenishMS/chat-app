import { Service } from "typedi";
import { ApiResponse } from "../../base/interfaces/api-response.interface";
import { IUser } from "../../user/interface/user.interface";
import { UserService } from "../../user/services/user.service";
import { ILoginRequest } from "../interfaces/login-request.interface";
import { ISignupRequest } from "../interfaces/signup-request.interface";
import { TokenParams } from "../interfaces/token-params.interface";
import * as JWT from 'jsonwebtoken';

@Service()
export class AuthService {
    privateKey = process.env.PRIVATE_KEY || 'chatApP';
    expire = process.env.passwordExpire || '1d'; // one day validity
    constructor(private userService: UserService) {
    }

    async signUp(data: ISignupRequest): Promise<ApiResponse<any>> {
        try {
            const isEmailExists = !!await this.userService.getUserByEmail(data.email);
            if(isEmailExists) {
                return this.userService.error('Email already exists');
            }
            
            const response = await this.userService.createUser(data);
            if(response)                        
                return this.userService.success({}, 'Success');	
            else
                return this.userService.error('Signup failed');
        } catch (err) {
            return this.userService.error('Error in signUp', err);	
        }
    }
    async signIn(data: ILoginRequest): Promise<ApiResponse<{user: IUser, token:string}>> {
        try {
            const isEmailExists = !!await this.userService.getUserByEmail(data.email);
            if(!isEmailExists) {
                return this.userService.error('User not exists');
            }

            const user = await this.userService.checkUserLogin(data) as IUser;
            if(!user) 
                return this.userService.error('Password wrong.'); 

            const tokenParams: TokenParams = {
                id: user?._id,
                name: user.name,
                email: user.email,
                dob: user.dob
                };
                const token = JWT.sign(tokenParams, this.privateKey, { expiresIn: this.expire });
            return this.userService.success({user,token}, 'Success');
        } catch (err) {
            return this.userService.error('Failed!', err);	
        }
    }
}