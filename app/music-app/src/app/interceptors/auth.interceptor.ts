/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tokenDev } from 'src/auth-dev';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clone = request.clone({
      headers: request.headers.set('Content-Type', 'application/json'),
    });
    if (!environment.production) {
      const devRequest = clone.clone({
        headers: request.headers.set('Authorization', `${tokenDev}`),
      });
      return next.handle(devRequest);
    }
    return next.handle(clone);
  }
}
