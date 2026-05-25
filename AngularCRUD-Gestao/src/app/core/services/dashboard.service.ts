import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { DashboardStats } from '../../shared/models/dashboard.model';
import { AuthStore } from '../auth/auth.store';
import { CollabService } from './collab.service';
import { DeviceService } from './device.service';
import { OrgService } from './org.service';

export type { DashboardStats } from '../../shared/models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly deviceService = inject(DeviceService);
  private readonly collabService = inject(CollabService);
  private readonly orgService = inject(OrgService);
  private readonly authStore = inject(AuthStore);

  getStats(): Observable<DashboardStats> {
    const devices$ = this.deviceService.findAll();
    const collabs$ = this.collabService.findAll();
    const orgs$ = this.authStore.canAccessOrganizations() ? this.orgService.findAll() : of([]);

    return forkJoin({
      devices: devices$,
      collabs: collabs$,
      orgs: orgs$,
    }).pipe(
      map((results) => ({
        totalDevices: results.devices.length,
        totalCollaborators: results.collabs.length,
        totalOrganizations: results.orgs.length,
      }))
    );
  }
}
