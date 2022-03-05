import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { io,Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketEnum } from 'src/app/enums/socket.enum';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  socket!: Socket<DefaultEventsMap, DefaultEventsMap>;
  chatRooms: any[] = [];
  socketId: string = '';
  chatConfig:any;
  chatRoom!: string;
  chats: any[] = [];
  @Input() userId: any;
  message = '';
  isLoading = false;
  currentUserId!: string;
  constructor(private appService: AppService, private authService: AuthService) { 
    this.socket = io(environment.chatServerUrl, {
      extraHeaders: {
        Authorization: this.authService.getAccessToken(),
      }
    });
  }
  
  async ngOnInit(): Promise<void> {
    this.currentUserId = this.appService.userDetails.id;
    console.log(this.currentUserId);
    
    
    this.socket.on('connect', () => {
      this.socketId = this.socket.id;
        this.makeUserOnline();

        this.socket.on(SocketEnum.RECEIVE_MESSAGE, (data: any) => {
          console.log(data, 'Message received');
          if(data.userId) {
              if(this.userId === data.userId) {
                this.chats.push(data.data);
              }
          }
          // this.chats.push(data);
        });
    });    
  }
  
  async ngOnChanges(changes: SimpleChanges) {
    if((changes as any).userId) {
      this.isLoading = true;
      const response = await this.appService.userChat(this.userId);
      this.isLoading = false;
      if(response.status) {
        this.chats = response.data;
      }
    }
  }

  async send() {
    const response = await this.appService.sendMessage({
      to: this.userId,
      message: this.message,
    });

    if(response.status) {
      this.message = '';
      this.chats.push(response.data);
      this.socket.emit(SocketEnum.SEND_MESSAGE, {
        userId: this.userId,
        data: response.data
      });
      
    }
  }

  async makeUserOnline() {
    const isLoggedIn = this.authService.isAuthorizedUser;
    if (!isLoggedIn) {
      return;
    }
    if (!this.socketId) {
      console.log('Socket didn\'t connected',);
    }
    this.socket.emit(SocketEnum.I_AM_ONLINE, this.currentUserId);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.socket.emit(SocketEnum.I_AM_OFFLINE, this.currentUserId);
  }
}
