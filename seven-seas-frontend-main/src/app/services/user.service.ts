import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Report, User } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly API: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getUser(id: string) {
    return this.httpClient.get<any>(`${this.API}/users/user/${id}`);
  }

  updateProfilePicture(formData: FormData) {
    return this.httpClient.post<any>(`${this.API}/users/user/profile-picture/`, formData);
  }

  updateCover(formData: FormData) {
    return this.httpClient.post<any>(`${this.API}/users/user/cover-photo/`, formData);
  }

  follow(userId: string, follow: boolean) {
    return this.httpClient.put<any>(`${this.API}/users/follow/${userId}`, { follow });
  }

  getFeedUsers() {
    return this.httpClient.get<any>(`${this.API}/users/feed/`);
  }

  getNotifications() {
    return this.httpClient.get<any>(`${this.API}/users/notifications`);

  }

  search(keyword: string) {
    return this.httpClient.get<any>(`${this.API}/users/search/${keyword}`);
  }

  reportUser(report : Report){
    return this.httpClient.post<any>(`${this.API}/users/report`, report);
  }

}
