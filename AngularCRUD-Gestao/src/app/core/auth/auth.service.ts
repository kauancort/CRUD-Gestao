import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthStore } from './auth.store';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../../shared/models/auth.model';
import { Collaborator } from '../../shared/models/collaborator.model';

export type { LoginRequest, RegisterRequest } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly api = `${environment.apiUrl}/auth`;

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, data);
  }

  resolveCurrentUser(email: string): Observable<User> {
    const normalizedEmail = email.trim().toLowerCase();

    return this.http.get<Collaborator[]>(`${environment.apiUrl}/collabs/find-all`).pipe(
      map((collabs) => this.collaboratorToUser(this.findByEmail(collabs, normalizedEmail), 'MANAGER')),
      catchError(() =>
        this.http.get<Collaborator[]>(`${environment.apiUrl}/collabs`).pipe(
          map((collabs) => this.collaboratorToUser(this.findByEmail(collabs, normalizedEmail), 'OPERATOR'))
        )
      ),
      switchMap((user) => (user ? of(user) : throwError(() => new Error('Usuario autenticado nao encontrado'))))
    );
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.api}/register`, data, {
      observe: 'response',
      responseType: 'text',
    });
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.authStore.clearAuth();

    void this.router.navigate(['/login']);
  }

  private findByEmail(collabs: Collaborator[], email: string): Collaborator | undefined {
    return collabs.find((collab) => collab.email.trim().toLowerCase() === email);
  }

  private collaboratorToUser(collaborator: Collaborator | undefined, fallbackRole: User['role']): User | null {
    if (!collaborator) {
      return null;
    }

    return {
      id: collaborator.id,
      email: collaborator.email,
      fullName: collaborator.fullName,
      role: collaborator.accessLevel ?? fallbackRole,
      organizationId: collaborator.organizationId,
    };
  }
}
