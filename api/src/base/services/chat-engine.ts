import express from "express";
import { Socket } from "socket.io";
import { SocketEnum } from "../enums/socket.enum";

export async function chatEngine() {
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
  

    const onlineUsers: any = {};
  io.on("connection", (socket: Socket) => {      
      socket.on(SocketEnum.I_AM_ONLINE, (userId: any) => {          
          onlineUsers[userId] = socket.id;
          console.log('I am Online', userId);
          console.log(onlineUsers);
          
            socket.emit(SocketEnum.RECEIVE_MESSAGE, {userId}, { sent_to:  [onlineUsers[userId]]});
        });
        
        socket.on(SocketEnum.SEND_MESSAGE, (data: any) => {
            console.log('Message received', onlineUsers);
            
            // if(data?.userId && onlineUsers[data.userId]) {
            //     console.log('Message Sending to '+ data.userId);
            //     socket.emit(SocketEnum.RECEIVE_MESSAGE, data.data, { sent_to:  [onlineUsers[data.userId]]});
            // }
            socket.emit(SocketEnum.RECEIVE_MESSAGE, data, { sent_to:  [onlineUsers[data.userId]]});
        });
    
        socket.on(SocketEnum.I_AM_OFFLINE, (userId: any) => {
            delete onlineUsers[userId];
        });
    });
}