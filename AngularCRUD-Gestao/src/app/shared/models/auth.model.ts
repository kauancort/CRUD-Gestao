export type Role = 'MANAGER' | 'OPERATOR';

export type RegisterRole = Role;

export interface User {
  id?: number;
  email: string;
  fullName?: string;
  role: Role;
  organizationId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  accessLevel: RegisterRole;
  organizationId: number;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface RegisterResponse {
  message?: string;
  user?: User;
}
