import { Injectable } from '@angular/core';
import { EventBusService } from './event-bus.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService {

  constructor(private eventBus: EventBusService, private authService: AuthService, private router: Router) {
    this.listenToUnauthorized();
  }

  private listenToUnauthorized() {
    this.eventBus.unauthorized$.subscribe(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
    });
  }
}
