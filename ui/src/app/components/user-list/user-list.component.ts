import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketEnum } from 'src/app/enums/socket.enum';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  private _users: any[] = [];
  show = '';
  selectedUser: any;
  searchText = '';
  isLoading = false;
  currentUserId!: string;

  socket!: Socket<DefaultEventsMap, DefaultEventsMap>;
  socketId: string = '';
  audio = new Audio('/assets/sounds/notification.mp3');
  makeLoginUser$ = new BehaviorSubject<any>(null);
  
  constructor(private appService: AppService, private authService: AuthService, private router: Router) {
    this.socket = io(environment.chatServerUrl, {
      extraHeaders: {
        Authorization: this.authService.getAccessToken(),
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.currentUserId = this.appService.userDetails.id; 
    await this.getUserList();
    this.connectSocket();    
  }

  async getUserList() {
    const response = await this.appService.getUsers();
    this.isLoading = false;
    if(response.status) {
      this.users = this._users = response.data.filter((user: any) => user._id !== this.currentUserId);
    }
  }

  view(user: any) {
    this.selectedUser = user;
    this.show = 'view';
  }
  
  chat(user: any, index: number) {
    this.selectedUser = user;
    this.users[index].hasMsg = false; 
    this.show = 'chat';
  }

  searchUser() {
    if(!this.searchText) { this.users = this._users; return; }
    this.users = this._users.filter(user => {
      return user.name.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  close() {
    this.show = '';
  }

  connectSocket() {    
    this.socket.on('connect', () => {
      this.socketId = this.socket.id;
      this.socketEvents();      
    });  
    this.socketEvents();
  }

  socketEvents() {
    this.makeUserOnline();

    this.socket.on(SocketEnum.RECEIVE_MESSAGE, (receivedData: any) => {
      if(receivedData?.data.from === this.selectedUser?._id && this.show === 'chat') {
        
        this.appService.newMessage$.next(receivedData.data);
      } else {
        this.playNotificationSound();
        this.users = this.users.map(user => {
          let hasMsg = user.hasMsg ?? 0;
          if(user._id === receivedData?.data.from) {
            hasMsg = hasMsg+ 1;
          } 
          return {
            ...user,
            hasMsg: hasMsg
          }
        });
      }
    });

    this.socket.on(SocketEnum.ONLINE_USERS, (data: any) => {
      this.users = this.users.map(user => {
          return {
            ...user,
            online: data.includes(user._id)
          }
        });
    });
  }

  playNotificationSound() {
    this.audio.play();
  }

  async makeUserOnline() {
    this.socket.emit(SocketEnum.I_AM_ONLINE, this.currentUserId);
  }

  sendMessage(data: any) {
    this.socket.emit(SocketEnum.SEND_MESSAGE, data);
  }

  /**
   * Logout User
   */
  logout() {
    this.socket.emit(SocketEnum.I_AM_OFFLINE, this.currentUserId);
    this.socket.close();
    this.authService.logout();
    this.router.navigateByUrl('/signin');
  }

  ngOnDestroy(): void {
    this.socket.emit(SocketEnum.I_AM_OFFLINE, this.currentUserId);
  }
}
