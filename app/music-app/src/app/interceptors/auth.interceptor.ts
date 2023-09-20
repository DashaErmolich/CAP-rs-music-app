// import {
//   HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
// } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';

// import { environment } from 'src/environments/environment';
// import { LocalStorageService } from '../services/local-storage.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(
//     private localStore: LocalStorageService,
//   ) {}

//   // eslint-disable-next-line class-methods-use-this
//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler,
//   ): Observable<HttpEvent<any>> {
//     console.log(environment);
//     if (!environment.production) {
//       const authReq = req.clone({
//         withCredentials: false,
//         headers: req.headers.set('Authorization', 'Basic ZGFzaGEuZXJtb2xpY2hAZ21haWwuY29tOg=='),
//       });
//       return next.handle(authReq);
//     }
//     return next.handle(req);
//   }
// }

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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clone = request.clone({
      headers: request.headers.set('Content-Type', 'application/json'),
    });
    if (!environment.production) {
      const devRequest = clone.clone({
        headers: request.headers.set('Authorization', 'Basic ZGFzaGEuZXJtb2xpY2hAZ21haWwuY29tOg=='),
      });
      return next.handle(devRequest);
    }
    return next.handle(clone);
  }
}
