import jwtDecode from 'jwt-decode';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
* Service for authenticate users
*
* @export
* @class AuthService
*/
export class AuthService {
  isAuthorizedUser = false;
  /**
   * Creates an instance of AuthService.
   * @param {notificationService} notificationService
   * @param {LoggerService} logService
   * @memberof AuthService
   */
  constructor() {
  }


  /**
   * Save access token and change isAuthorizedUser status
   *
   * @param {string} token auth token string
   * @param {string} refreshToken refresh token string
   * @return {boolean}
   * @memberof AuthService
   */
  setToken(token: string): boolean {
    try {
      this.setAccessToken(token);
      this.isAuthorizedUser = true;
      return this.isAuthorizedUser;
    } catch (err) {
      this.isAuthorizedUser = false;
      return this.isAuthorizedUser;
    }
  }

  getDecodedToken() {
    const token = this.getAccessToken();
    const decodeToken = jwtDecode(token);
    return decodeToken;
  }

  /**
   * Get access token from local storage
   *
   * @return {*}  {(string | null)}
   * @memberof AuthService
   */
  getAccessToken(): string {
    try {
      return localStorage.getItem('token') ?? '';
    } catch (error) {
      return '';
    }
  }

  /**
   * save access token and save isLoggedIn status to local storage
   *  private function
   * @private
   * @param {string} token token string get after authentication request
   * @memberof AuthService
   */
  private setAccessToken(token: string) {
    try {
      localStorage.setItem('token', token);
      // set access Token expire time
      const millisecondForADay = 24 * 60 * 60 * 1000;
      const nextHour = new Date().getTime() + millisecondForADay;
      localStorage.setItem('tokenExpiryTime', nextHour.toString());
    } catch (error) {
    }
  }

  /**
   * Verify user login
   *
   * @return {*}  {boolean}
   * @memberof AuthService
   */
  verifyUserLogin(): boolean {
    const token = localStorage.getItem('token');
    const tokenExpiryTime = localStorage.getItem('tokenExpiryTime');
    const isTimeNotExpired = (+tokenExpiryTime!) > new Date().getTime();
    const isValidUser = token && isTimeNotExpired;

    if (isValidUser) {
      this.isAuthorizedUser = true;
      return this.isAuthorizedUser;
    } else {
      this.isAuthorizedUser = false;
      return this.isAuthorizedUser;
    }
  }

  /**
   * Logout user and reset all auth activity
   *
   * @memberof AuthService
   */
  logout() {
      this.isAuthorizedUser = false;
      localStorage.clear();
  }
}
