import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Event } from '../interfaces/event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  readonly API: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  createEvent(formData: FormData) {
    return this.httpClient.post<any>(`${this.API}/events/new`, formData);
  }
  updateEvent(formData: FormData, id: string) {
    return this.httpClient.put<any>(`${this.API}/events/${id}`, formData);
  }
  deleteEvent(id: string) {
    return this.httpClient.delete<any>(`${this.API}/events/${id}`);
  }


  getEventByMonth(month: number) {
    return this.httpClient.get<any>(`${this.API}/events/month/${month}`);
  }

  getTodayEvents() {
    return this.httpClient.get<any>(`${this.API}/events/today`);
  }
  getUpcoming() {
    return this.httpClient.get<any>(`${this.API}/events/upcoming`);
  }

  getAll() {
    return this.httpClient.get<any>(`${this.API}/events/all/`);
  }

}
