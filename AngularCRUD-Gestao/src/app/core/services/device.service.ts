import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Device, DeviceRequest, DeviceRequestCondition } from '../../shared/models/device.model';
import { AuthStore } from '../auth/auth.store';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly api = `${environment.apiUrl}/devices`;

  findAll(): Observable<Device[]> {
    const endpoint = this.authStore.canViewAllRecords() ? `${this.api}/find-all` : this.api;
    return this.http.get<Device[]>(endpoint);
  }

  findById(id: number): Observable<Device> {
    return this.http.get<Device>(`${this.api}/${id}`);
  }

  create(data: DeviceRequest): Observable<Device> {
    return this.http.post<Device>(this.api, data);
  }

  update(id: number, data: DeviceRequestCondition): Observable<Device> {
    return this.http.put<Device>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
