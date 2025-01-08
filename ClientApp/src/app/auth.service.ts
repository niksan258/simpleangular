import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseUrl : string;

  constructor(private httpClient: HttpClient,  @Inject('BASE_URL') baseUrl: string) { this.baseUrl = baseUrl}

  login = (email: string, password: string) => {

    const user = {
      email: email,
      password: password
    }

    return this.httpClient.post(`${this.baseUrl}auth/login`, user);
  }
}
