import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  readonly API: string = environment.apiUrl + '/equipments';

  constructor(private httpClient: HttpClient) { }

  createBoat(formData: FormData) {
    return this.httpClient.post<any>(`${this.API}/boat/new`, formData);
  }

  createEquipment(formData: FormData) {
    return this.httpClient.post<any>(`${this.API}/equipment/new`, formData);
  }
  createHebergement(formData: FormData) {
    return this.httpClient.post<any>(`${this.API}/hebergement/new`, formData);
  }

  updateHebergement(formData: FormData, id: string) {
    return this.httpClient.put<any>(`${this.API}/hebergement/${id}`, formData);
  }
  updateBoat(formData: FormData, id: string) {
    return this.httpClient.put<any>(`${this.API}/boat/${id}`, formData);
  }

  updateEquipment(formData: FormData, id: string) {
    return this.httpClient.put<any>(`${this.API}/equipment/${id}`, formData);
  }
  updateEvent(formData: FormData, id: string) {
    return this.httpClient.put<any>(`${this.API}/event/${id}`, formData);
  }
  getEquipmentTypes() {
    return this.httpClient.get<any>(`${this.API}/types`);
  }

  getEquipmentsByUser(userId: string) {
    return this.httpClient.get<any>(`${this.API}/user/${userId}`);
  }

  getEquipmentsByTypeAndUser(typeId: string, userId: string) {
    return this.httpClient.get<any>(`${this.API}/type/${typeId}/user/${userId}`);
  }

  getBoatsByUser(userId: string) {
    return this.httpClient.get<any>(`${this.API}/boats/user/${userId}`);
  }
  getHebergementsByUser(userId: string) {
    return this.httpClient.get<any>(`${this.API}/hebergements/user/${userId}`);
  }

  getHebergements() {
    return this.httpClient.get<any>(`${this.API}/hebergements/all/`);
  }

  deleteEquipment(id: string) {
    return this.httpClient.delete<any>(`${this.API}/equipment/${id}`);
  }

  deleteBoat(id: string) {
    return this.httpClient.delete<any>(`${this.API}/boat/${id}`);
  }

  deleteHebergement(id: string) {
    return this.httpClient.delete<any>(`${this.API}/hebergement/${id}`);
  }

}