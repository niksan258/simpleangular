import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDetailsResponse } from '../dtos/user-details-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}

  getCurrentUserDetails() {
    return this.http.get<UserDetailsResponse>(`${this.baseUrl}users/me`);
  }
}
