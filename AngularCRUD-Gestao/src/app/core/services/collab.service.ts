import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Collaborator,
  CollaboratorRequest,
  CollaboratorUpdateRequest,
} from '../../shared/models/collaborator.model';
import { AuthStore } from '../auth/auth.store';

@Injectable({
  providedIn: 'root',
})
export class CollabService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly api = `${environment.apiUrl}/collabs`;

  findAll(): Observable<Collaborator[]> {
    const endpoint = this.authStore.canViewAllRecords() ? `${this.api}/find-all` : this.api;
    return this.http.get<Collaborator[]>(endpoint);
  }

  findById(id: number): Observable<Collaborator> {
    return this.http.get<Collaborator>(`${this.api}/${id}`);
  }

  create(data: CollaboratorRequest): Observable<Collaborator> {
    return this.http.post<Collaborator>(this.api, data);
  }

  update(id: number, data: CollaboratorUpdateRequest): Observable<Collaborator> {
    return this.http.put<Collaborator>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
