import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, MonitorSmartphone, Users, Building2, LogOut } from 'lucide-angular';
import { AuthStore } from '../../../core/auth/auth.store';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);

  // Ícones do Lucide
  readonly LayoutDashboard = LayoutDashboard;
  readonly MonitorSmartphone = MonitorSmartphone;
  readonly Users = Users;
  readonly Building2 = Building2;
  readonly LogOut = LogOut;

  logout() {
    this.authService.logout();
  }
}
