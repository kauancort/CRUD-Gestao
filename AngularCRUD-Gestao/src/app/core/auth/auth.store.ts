import { computed, Injectable, signal } from '@angular/core';
import { Role, User } from '../../shared/models/auth.model';

interface JwtPayload {
  sub?: string;
  email?: string;
  fullName?: string;
  name?: string;
  role?: string;
  accessLevel?: string;
  authorities?: readonly string[];
  organizationId?: number | string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly userStorageKey = 'auth_user';
  private readonly _currentUser = signal<User | null>(null);
  private readonly _token = signal<string | null>(localStorage.getItem('token'));
  private readonly _isLoading = signal<boolean>(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly currentRole = computed(() => this.currentUser()?.role ?? null);
  readonly isManager = computed(() => this.currentUser()?.role === 'MANAGER');
  readonly isOperator = computed(() => this.currentUser()?.role === 'OPERATOR');
  readonly canViewAllRecords = computed(() => this.isManager());
  readonly canManageRecords = computed(() => this.isManager());
  readonly canAccessOrganizations = computed(() => this.isManager());
  readonly organizationId = computed(() => this.currentUser()?.organizationId ?? null);
  readonly organizationLabel = computed(() => {
    const organizationId = this.organizationId();
    return organizationId ? `Organizacao #${organizationId}` : 'Organizacao nao informada';
  });

  constructor() {
    this.initFromToken();
  }

  setToken(token: string, user?: User): void {
    localStorage.setItem('token', token);
    this._token.set(token);
    if (user) {
      this.setCurrentUser(user);
      return;
    }

    this.decodeAndSetUser(token);
  }

  setCurrentUser(user: User): void {
    const normalizedUser: User = {
      ...user,
      role: this.normalizeRole(user.role),
      organizationId: Number(user.organizationId ?? 0),
    };

    localStorage.setItem(this.userStorageKey, JSON.stringify(normalizedUser));
    this._currentUser.set(normalizedUser);
  }

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(this.userStorageKey);
    this._token.set(null);
    this._currentUser.set(null);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  private initFromToken(): void {
    const currentToken = this._token();
    if (currentToken) {
      const storedUser = this.getStoredUser();
      if (storedUser) {
        this._currentUser.set(storedUser);
        return;
      }

      this.decodeAndSetUser(currentToken);
    }
  }

  private decodeAndSetUser(token: string): void {
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        this.clearAuth();
        return;
      }

      const decodedJson = atob(this.toBase64(payloadBase64));
      const payload = JSON.parse(decodedJson) as unknown;
      if (!this.isJwtPayload(payload)) {
        this.clearAuth();
        return;
      }

      const roleExtracted = payload.role ?? payload.accessLevel ?? payload.authorities?.[0] ?? 'OPERATOR';
      const cleanRole = this.normalizeRole(roleExtracted);

      this.setCurrentUser({
        email: payload.sub || payload.email || '',
        fullName: payload.fullName || payload.name || 'Usuario',
        role: cleanRole,
        organizationId: Number(payload.organizationId ?? 0),
      });
    } catch (err) {
      console.error('Failed to decode JWT', err);
      this.clearAuth();
    }
  }

  private normalizeRole(role: string): Role {
    const cleanRole = role.replace('ROLE_', '');
    return this.isRole(cleanRole) ? cleanRole : 'OPERATOR';
  }

  private isRole(role: string): role is Role {
    return role === 'MANAGER' || role === 'OPERATOR';
  }

  private isJwtPayload(value: unknown): value is JwtPayload {
    if (!this.isRecord(value)) {
      return false;
    }

    const authorities = value['authorities'];
    return (
      this.isOptionalString(value['sub']) &&
      this.isOptionalString(value['email']) &&
      this.isOptionalString(value['fullName']) &&
      this.isOptionalString(value['name']) &&
      this.isOptionalString(value['role']) &&
      this.isOptionalString(value['accessLevel']) &&
      this.isOptionalNumberOrString(value['organizationId']) &&
      (authorities === undefined || this.isStringArray(authorities))
    );
  }

  private getStoredUser(): User | null {
    const rawUser = localStorage.getItem(this.userStorageKey);
    if (!rawUser) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawUser) as unknown;
      if (!this.isStoredUser(parsed)) {
        return null;
      }

      return {
        ...parsed,
        role: this.normalizeRole(parsed.role),
        organizationId: Number(parsed.organizationId),
      };
    } catch {
      return null;
    }
  }

  private isStoredUser(value: unknown): value is User {
    return (
      this.isRecord(value) &&
      this.isOptionalNumberOrString(value['id']) &&
      typeof value['email'] === 'string' &&
      this.isOptionalString(value['fullName']) &&
      typeof value['role'] === 'string' &&
      this.isOptionalNumberOrString(value['organizationId'])
    );
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isOptionalString(value: unknown): value is string | undefined {
    return value === undefined || typeof value === 'string';
  }

  private isOptionalNumberOrString(value: unknown): value is number | string | undefined {
    return value === undefined || typeof value === 'number' || typeof value === 'string';
  }

  private isStringArray(value: unknown): value is readonly string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
  }

  private toBase64(base64Url: string): string {
    const normalized = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = (4 - (normalized.length % 4)) % 4;
    return normalized.padEnd(normalized.length + paddingLength, '=');
  }
}
