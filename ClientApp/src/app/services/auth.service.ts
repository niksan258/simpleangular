import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject: BehaviorSubject<string | null>;
  public token$: Observable<string | null>;

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    const savedToken = localStorage.getItem('jwt');
    this.tokenSubject = new BehaviorSubject<string | null>(savedToken);
    this.token$ = this.tokenSubject.asObservable();
  }

  login(email: string, password: string) {
    const user = { email, password };

    return this.httpClient.post<{ token: string }>(`${this.baseUrl}auth/login`, user).pipe(
      tap(response => {
        this.storeToken(response.token);
      })
    );
  }

  register(email: string, password: string) {
    const user = { email, password };
    return this.httpClient.post(`${this.baseUrl}auth/register`, user);
  }

  private storeToken(token: string): void {
    localStorage.setItem('jwt', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.tokenSubject.next(null);
  }
}
