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
          const filteredList = Object.keys(onlineUsers).filter((id: string) => id !== userId);    
          socket.to(onlineUsers[userId]).emit(SocketEnum.ONLINE_USERS, filteredList, Object.keys(onlineUsers));          
        });
        
        socket.on(SocketEnum.SEND_MESSAGE, (data: any) => {                        
            if(onlineUsers[data.userId]) {
                socket.to(onlineUsers[data.userId]).emit(SocketEnum.RECEIVE_MESSAGE,data, data.data);
            }
        });
    
        socket.on(SocketEnum.I_AM_OFFLINE, (userId: any) => {
            delete onlineUsers[userId];
        });

        socket.on("disconnect", () => {
            console.log('Client disconnect', socket.id); // undefined
        });
    });
    io.on('disconnect', () => {
      });
}