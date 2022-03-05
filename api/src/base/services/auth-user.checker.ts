import * as JWT from 'jsonwebtoken';
import { Action, UnauthorizedError } from 'routing-controllers';
import Container from 'typedi';
import { UserService } from '../../user/services/user.service';

// Check every api request has the authorization for specific request
export const AuthUserChecker = async (action: Action) => {
  try {
    const token = action.request.headers?.authorization;
    
    if (!token) return false;
    const privateKey = process.env.PRIVATE_KEY || 'chatApP';
    const loggedUser = JWT.verify(token, privateKey) as any;
    const userService = Container.get(UserService);
    const user = await userService.getById(loggedUser.id);
    
    if (user) {
      return user;
    } else {
      throw new UnauthorizedError('You are not authorized to the particular page');
    }
  } catch (e) {
    console.error(e);
    throw new UnauthorizedError('Error in Authorization');
  }
};
