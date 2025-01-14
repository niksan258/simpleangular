import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { EventBusService } from '../services/event-bus.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private eventBus: EventBusService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        const token = this.authService.getToken();

        const authReq = token
          ? request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            })
          : request;
    
        return next.handle(authReq).pipe(
          catchError((error : HttpErrorResponse) => {
            if (error.status === 401) {
              this.eventBus.emitUnauthorized();
            }
            throw error;
          })
        );
  }
}
