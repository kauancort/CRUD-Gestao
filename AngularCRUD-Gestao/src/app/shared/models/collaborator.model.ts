import { Organization } from './organization.model';

export type CollaboratorType = 'MANAGER' | 'OPERATOR';

export interface Collaborator {
  id: number;
  fullName: string;
  email: string;
  accessLevel: CollaboratorType;
  organizationId: number;
}

export interface CollaboratorRequest {
  fullName: string;
  email: string;
  password?: string;
  accessLevel: CollaboratorType;
  organizationId: number;
}

export interface CollaboratorUpdateRequest {
  fullName?: string;
  email?: string;
  password?: string;
  accessLevel?: CollaboratorType;
  organization?: Organization;
}
