import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

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
  constructor(private appService: AppService) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    const response = await this.appService.getUsers();
    this.isLoading = false;
    if(response.status) {
      this.users = this._users = response.data;
    }
  }

  view(user: any) {
    this.selectedUser = user;
    this.show = 'view';
  }
  
  chat(user: any) {
    this.selectedUser = user;
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
}
