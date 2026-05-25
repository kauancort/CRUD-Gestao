import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../core/auth/auth.store';
import { LucideAngularModule, MonitorSmartphone, Users, Building2 } from 'lucide-angular';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  readonly authStore = inject(AuthStore);
  private dashboardService = inject(DashboardService);

  stats = signal<DashboardStats>({
    totalDevices: 0,
    totalCollaborators: 0,
    totalOrganizations: 0
  });
  loading = signal<boolean>(true);

  readonly MonitorSmartphone = MonitorSmartphone;
  readonly Users = Users;
  readonly Building2 = Building2;

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching dashboard stats', err);
        this.loading.set(false);
      }
    });
  }
}
