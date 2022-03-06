import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  userDetails:any;
  newMessage$ = new Subject<any>();
  constructor(private http: HttpClient, private authService: AuthService) { }

  async createUser(data: any): Promise<any> {
      return this.http.post(`${environment.apiUrl}/auth/signup`, data).toPromise();
  }

  async signinUser(data: any): Promise<any> {
      return this.http.post(`${environment.apiUrl}/auth/signin`, data).toPromise();
  }

  async getUsers(): Promise<any> {
      return this.http.get(`${environment.apiUrl}/user/all`).toPromise();
  }
  
  async userChat(userId: string): Promise<any> {
      return this.http.get(`${environment.apiUrl}/chat/${userId}`).toPromise();
  }

  async sendMessage(data: any): Promise<any> {
      return this.http.post(`${environment.apiUrl}/chat/send`, data).toPromise();
  }

  async getUser(userId: string): Promise<any> {
      return this.http.get(`${environment.apiUrl}/user/${userId}`).toPromise();
  }

  getUserDetailsFromToken() {
    if(!this.userDetails) {
      const isLoggedIn = this.authService.verifyUserLogin();
      if (isLoggedIn) {
        const token = this.authService.getDecodedToken();
        this.userDetails = token;
      }
    }
  }
}
