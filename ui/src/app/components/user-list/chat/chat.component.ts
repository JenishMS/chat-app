import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chats: any[] = [];
  @Input() userId: any;
  @Output() sendMessage = new EventEmitter();
  message = '';
  isLoading = false;
  currentUserId!: string;

  constructor(private appService: AppService, private authService: AuthService) { 
  }
  
  async ngOnInit(): Promise<void> {
    this.currentUserId = this.appService.userDetails.id;   
    this.appService.newMessage$.subscribe((msg) => this.chats.push(msg));
  }
  
  async ngOnChanges(changes: SimpleChanges) {
    if((changes as any).userId) {
      this.isLoading = true;
      this.chats = [];
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
      this.sendMessage.emit({
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
  }
}
