import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()

/**
 * Interceptor for add access token for every API request
 *
 * @export
 * @class TokenInterceptor
 * @implements {HttpInterceptor}
 */
export class ApiInterceptor implements HttpInterceptor {
  /**
   * Creates an instance of TokenInterceptor.
   * @param {AuthService} authService
   * @param {Router} router
   * @param {LoggerService} logService
   * @param {LoaderService} loaderService
   * @memberof TokenInterceptor
   */
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }
  /**
   * Function for intercept Request & Response
   *
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @return {*}  {Observable<HttpEvent<any>>}
   * @memberof TokenInterceptor
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    const modifiedRequest = request.clone({
      headers: request.headers.append('Authorization', token),
    });
    return next.handle(modifiedRequest).pipe(catchError((x) => {
      return this.handleError(x);
    }), map((response) => {
      return response;
    }));
  }

  /**
   * To catch error while API request or response
   * Check error and redirect to login page
   * @private
   * @param {HttpErrorResponse} err
   * @return {*}  {Observable<any>}
   * @memberof TokenInterceptor
   */
  private handleError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return of(err.message);
    }
    return throwError(err);
  }
}
