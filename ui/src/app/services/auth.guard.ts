import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})

/**
 * service class for routing guard
 *
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
export class AuthGuard implements CanActivate {
  /**
   * Creates an instance of AuthGuard.
   * @param {Router} router
   * @param {AuthService} authService
   * @memberof AuthGuard
   */
  constructor(private router: Router, private authService: AuthService) { }
  /**
   * Check is valid route
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @return {*}  {(Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree)}
   * @memberof AuthGuard
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const verifyUser = this.authService.verifyUserLogin();
    if (!verifyUser) {
      console.error('Not Valid token');

      this.authService.logout();
      this.router.navigateByUrl('/signin');
    }
    return verifyUser;
  }
  /**
   * Check is valid route for child
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @return {*}
   * @memberof AuthGuard
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}
