import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private unauthorizedSubject = new Subject<void>();
  
  unauthorized$ = this.unauthorizedSubject.asObservable();
  
  emitUnauthorized() {
    this.unauthorizedSubject.next();
  }
}
