import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public baseUrl: string;

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  login = (email: string, password: string) => {
    const user = {
      email: email,
      password: password
    };

    return this.httpClient.post<{ token: string }>(`${this.baseUrl}auth/login`, user).pipe(
      tap(response => {
        const token = response.token;
        this.storeToken(token); 
      })
    );
  }

  register = (email: string, password: string) => {
    const user = {
      email: email,
      password: password
    };

    return this.httpClient.post(`${this.baseUrl}auth/register`, user);
  }

  private storeToken(token: string): void {
    localStorage.setItem('jwt', token); 
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }
}
