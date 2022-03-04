import 'reflect-metadata'; // this shim is required
import express from 'express';
import {
  createExpressServer, CurrentUser, useContainer, useExpressServer
} from 'routing-controllers';
import Container from 'typedi';
import path from 'path';
import { AuthController } from './auth/controllers/auth.controller';

const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 3000;

async function startServer() {
    useContainer(Container);
    const app = express();
    useExpressServer(app, {
      cors: false,
      controllers: [AuthController],
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
