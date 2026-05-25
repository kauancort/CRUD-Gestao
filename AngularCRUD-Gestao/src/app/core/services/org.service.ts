import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Organization,
  OrganizationRequest,
  OrganizationRequestName,
} from '../../shared/models/organization.model';

@Injectable({
  providedIn: 'root',
})
export class OrgService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/orgs`;

  findAll(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.api);
  }

  findById(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.api}/${id}`);
  }

  create(data: OrganizationRequest): Observable<Organization> {
    return this.http.post<Organization>(this.api, data);
  }

  update(id: number, data: OrganizationRequestName): Observable<Organization> {
    return this.http.put<Organization>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
