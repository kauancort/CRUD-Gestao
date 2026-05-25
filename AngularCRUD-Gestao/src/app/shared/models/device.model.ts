export type DeviceCondition = 'NEW' | 'USED' | 'BROKEN';

export interface Device {
  id: number;
  model: string;
  assetTag: string;
  condition: DeviceCondition;
  organizationId: number;
}

export interface DeviceRequest {
  model: string;
  assetTag: string;
  condition: DeviceCondition;
  organizationId: number;
}

export interface DeviceRequestCondition {
  condition: DeviceCondition;
}
