import { Service } from "typedi";
import { CollectionEnum } from "../../base/enums/collection.enum";
import { BaseService } from "../../base/services/base.service";
import { IUser } from "../interface/user.interface";
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ISignupRequest } from "../../auth/interfaces/signup-request.interface";
import { ILoginRequest } from "../../auth/interfaces/login-request.interface";

@Service()
export class UserService extends BaseService {
    constructor() {
        super(CollectionEnum.USER);
        console.log('UserService');	
    }

    /**
     * Check if user exists by email
     * @param email 
     * @returns 
     */
    async getUserByEmail(email: string): Promise<IUser | Error> {
        try {
            const response = await this.collection.findOne({ email });
            return response;
        } catch (err) {
            return new Error('Error in userExists');
        }
    }

    async createUser(data: ISignupRequest) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(data.password, salt);
            const user = {
                ...data,
                _id: uuidv4(),
                password
            }
            return await this.collection.insertOne(user);
        } catch (err) {
            return new Error('Error in createUser');
        }
    }

    async checkUserLogin(data: ILoginRequest): Promise<IUser | any> {
        try {
            const user = await this.getUserByEmail(data.email);
            const checkPassword = bcrypt.compareSync(data.password, (user as IUser).password);
            if(checkPassword) {
                delete (user as any).password;
            }
            return checkPassword ? user : null;
        } catch (err) {
            return new Error('Error in createUser');
        }
    }
}