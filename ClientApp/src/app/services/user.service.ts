import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDetailsResponse } from '../dtos/user-details-response';
import { UserDetailsUpdateRequest } from '../dtos/user-details-update-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getCurrentUserDetails() {
    return this.httpClient.get<UserDetailsResponse>(`${this.baseUrl}users/me`);
  }

  updateCurrentUserDetails(user: UserDetailsUpdateRequest) {
    return this.httpClient.post(`${this.baseUrl}users/me`, user);
  }

  getAllUsers() {
    return this.httpClient.get<UserDetailsResponse[]>(`${this.baseUrl}users`);
  }
}
