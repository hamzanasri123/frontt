import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  readonly API: string = environment.apiUrl + '/admin';

  constructor(private httpClient: HttpClient) { }

  getUsers(count: number, skip: number) {
    return this.httpClient.get<any>(`${this.API}/users/${count}/${skip}`);
  }

  getOverview() {
    return this.httpClient.get<any>(`${this.API}/overview`);
  }

  createEquipmentType(formData: FormData) {
    return this.httpClient.post<any>(`${this.API}/equipment/addType`, formData);
  }

  deleteEquipmentType(id: string) {
    return this.httpClient.delete<any>(`${this.API}/equipment/${id}`,);
  }

  getReports(userId: string) {
    return this.httpClient.get<any>(`${this.API}/reports/${userId}`);
  }

  deleteReport(reportId: string) {
    return this.httpClient.delete<any>(`${this.API}/reports/${reportId}`);
  }

  updateUserStatus(userId: string, activated: boolean) {
    return this.httpClient.put<any>(`${this.API}/users/${userId}`, { activated });
  }

}
