export interface Organization {
  id: number;
  corporateName: string;
  registrationCode: number;
}

export interface OrganizationRequest {
  corporateName: string;
  registrationCode: number;
}

export interface OrganizationRequestName {
  corporateName: string;
}
