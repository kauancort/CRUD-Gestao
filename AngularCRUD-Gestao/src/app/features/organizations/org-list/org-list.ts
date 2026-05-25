import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Building2, CirclePlus, LucideAngularModule, Pencil, Search, Trash2, X } from 'lucide-angular';
import { AuthStore } from '../../../core/auth/auth.store';
import { OrgService } from '../../../core/services/org.service';
import { Organization } from '../../../shared/models/organization.model';

@Component({
  selector: 'app-org-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './org-list.html',
  styleUrl: './org-list.css',
})
export class OrgList implements OnInit {
  private readonly orgService = inject(OrgService);
  readonly authStore = inject(AuthStore);

  readonly orgs = signal<Organization[]>([]);
  readonly loading = signal<boolean>(true);
  readonly errorMessage = signal<string>('');
  readonly toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);
  readonly creating = signal<boolean>(false);
  readonly editingOrg = signal<Organization | null>(null);
  readonly deletingOrg = signal<Organization | null>(null);
  readonly saving = signal<boolean>(false);
  readonly deleting = signal<boolean>(false);
  searchId = '';
  editCorporateName = '';
  createForm = {
    corporateName: '',
    registrationCode: 0,
  };
  readonly Building2 = Building2;
  readonly CirclePlus = CirclePlus;
  readonly Pencil = Pencil;
  readonly Search = Search;
  readonly Trash2 = Trash2;
  readonly X = X;

  ngOnInit(): void {
    this.loadOrgs();
  }

  loadOrgs(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.orgService.findAll().subscribe({
      next: (response) => {
        this.orgs.set(response);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching orgs', err);
        this.errorMessage.set('Nao foi possivel carregar as organizacoes.');
        this.loading.set(false);
      },
    });
  }

  searchById(): void {
    const id = Number(this.searchId);
    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage.set('Informe um ID valido para buscar.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.orgService.findById(id).subscribe({
      next: (response) => {
        this.orgs.set([response]);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching organization by id', err);
        this.orgs.set([]);
        this.errorMessage.set('Nenhuma organizacao encontrada para esse ID.');
        this.loading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.searchId = '';
    this.loadOrgs();
  }

  openCreate(): void {
    if (!this.authStore.canManageRecords()) {
      return;
    }

    this.createForm = {
      corporateName: '',
      registrationCode: 0,
    };
    this.creating.set(true);
  }

  closeCreate(): void {
    if (!this.saving()) {
      this.creating.set(false);
    }
  }

  saveCreate(): void {
    if (!this.authStore.canManageRecords()) {
      return;
    }

    const payload = {
      corporateName: this.createForm.corporateName.trim(),
      registrationCode: Number(this.createForm.registrationCode),
    };

    if (!payload.corporateName || !Number.isInteger(payload.registrationCode) || payload.registrationCode <= 0) {
      this.showToast('error', 'Preencha nome e codigo de registro.');
      return;
    }

    this.saving.set(true);
    this.orgService.create(payload).subscribe({
      next: (created) => {
        this.orgs.update((items) => [created, ...items]);
        this.saving.set(false);
        this.creating.set(false);
        this.showToast('success', 'Organizacao criada com sucesso.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating organization', err);
        this.saving.set(false);
        this.showToast('error', 'Nao foi possivel criar a organizacao.');
      },
    });
  }

  openEdit(org: Organization): void {
    if (!this.authStore.canManageRecords()) {
      return;
    }

    this.editingOrg.set(org);
    this.editCorporateName = org.corporateName;
  }

  closeEdit(): void {
    if (!this.saving()) {
      this.editingOrg.set(null);
    }
  }

  saveEdit(): void {
    const org = this.editingOrg();
    const corporateName = this.editCorporateName.trim();
    if (!org || !this.authStore.canManageRecords()) {
      return;
    }

    if (!corporateName) {
      this.showToast('error', 'Informe o nome da organizacao.');
      return;
    }

    if (corporateName === org.corporateName) {
      this.showToast('error', 'Altere o nome antes de salvar.');
      return;
    }

    this.saving.set(true);
    this.orgService.update(org.id, { corporateName }).subscribe({
      next: (updated) => {
        this.orgs.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
        this.saving.set(false);
        this.editingOrg.set(null);
        this.showToast('success', 'Organizacao atualizada com sucesso.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating organization', err);
        this.saving.set(false);
        this.showToast('error', 'Nao foi possivel atualizar a organizacao.');
      },
    });
  }

  openDelete(org: Organization): void {
    if (!this.authStore.canManageRecords()) {
      return;
    }

    this.deletingOrg.set(org);
  }

  closeDelete(): void {
    if (!this.deleting()) {
      this.deletingOrg.set(null);
    }
  }

  confirmDelete(): void {
    const org = this.deletingOrg();
    if (!org || !this.authStore.canManageRecords()) {
      return;
    }

    this.deleting.set(true);
    this.orgService.delete(org.id).subscribe({
      next: () => {
        this.orgs.update((items) => items.filter((item) => item.id !== org.id));
        this.deleting.set(false);
        this.deletingOrg.set(null);
        this.showToast('success', 'Organizacao excluida com sucesso.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error deleting organization', err);
        this.deleting.set(false);
        this.showToast('error', 'Nao foi possivel excluir a organizacao.');
      },
    });
  }

  private showToast(type: 'success' | 'error', message: string): void {
    this.toast.set({ type, message });
    setTimeout(() => this.toast.set(null), 3200);
  }
}
