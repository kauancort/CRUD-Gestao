import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';
import { AuthStore } from '../../../core/auth/auth.store';
import { Role } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly authStore = inject(AuthStore);

  readonly ChevronDown = ChevronDown;

  get initials(): string {
    const user = this.authStore.currentUser();
    if (!user || !user.fullName) {
      return 'U';
    }

    const parts = user.fullName.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  get orgName(): string {
    return this.authStore.organizationLabel();
  }

  roleLabel(role: Role): string {
    return role === 'MANAGER' ? 'MANAGER' : 'OPERATOR';
  }
}
