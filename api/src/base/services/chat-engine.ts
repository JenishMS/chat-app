import express from "express";
import { Socket } from "socket.io";
import { SocketEnum } from "../enums/socket.enum";
const onlineUsers: any = {};

export function chatEngine() {
    const socket = require("socket.io");
    const app = express();
    const server = require('http').Server(app);
    const io = socket(server, {
    cors: {
      origin: 'http://localhost:4200/',
      // origin: [process.env.chatServerUrl, process.env.chatUiUrl, process.env.serverUrl, process.env.appUrl],
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true
    }
  });

  server.listen(+process.env.chatServerPort! ?? 3001, () => {
    console.log('Chat server started on ' + (+process.env.chatServerPort!) ?? 3001);
  });
  


  io.on("connection", (socket: Socket) => {
        socket.on(SocketEnum.I_AM_ONLINE, (userId: any) => {
            console.log('I am Online', userId);
            onlineUsers[userId] = socket.id;
            socket.emit(SocketEnum.RECEIVE_MESSAGE, {userId}, { sent_to:  [onlineUsers[userId]]});
            console.log(onlineUsers);
        });

        socket.on(SocketEnum.SEND_MESSAGE, (data: any) => {
            console.log('Message received', );
            console.log(onlineUsers);
            
            if(data?.userId && onlineUsers[data.userId]) {
                console.log('Message Sending to '+ data.userId);
                socket.emit(SocketEnum.RECEIVE_MESSAGE, data.data, { sent_to:  [onlineUsers[data.userId]]});
            }
        });
    
        socket.on(SocketEnum.I_AM_OFFLINE, (userId: any) => {
            delete onlineUsers[userId];
        });

        socket.on("connect", () => {
          console.log("Connected to chat server", socket.connected);
        });
        socket.on("disconnect", () => {
            console.log('Disconnect', socket.connected); // undefined
        });
    });
}