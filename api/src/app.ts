import 'reflect-metadata'; // this shim is required
import express from 'express';
import {
  Action,useContainer, useExpressServer
} from 'routing-controllers';
import Container from 'typedi';
import path from 'path';
import { AuthController } from './auth/controllers/auth.controller';
import { UserController } from './user/controllers/user.controller';
import { ChatController } from './chat/controllers/chat.controller';
import { CurrentUserChecker } from './base/services/current-user.checker';

const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 3000;

async function startServer() {
    useContainer(Container);
    const app = express();
    useExpressServer(app, {
      cors: false,
      authorizationChecker: CurrentUserChecker,
      controllers: [AuthController, UserController, ChatController],
      defaults: {
        paramOptions: {
          required: true,
        }
      }
    });

    app.use(express.static(path.join(__dirname, 'static')));

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    })
}

startServer();
function getEntityManager() {
  throw new Error('Function not implemented.');
}

