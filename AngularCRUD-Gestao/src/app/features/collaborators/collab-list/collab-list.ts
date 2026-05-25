import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CirclePlus, Eye, LucideAngularModule, Mail, Pencil, Search, Trash2, X } from 'lucide-angular';
import { AuthStore } from '../../../core/auth/auth.store';
import { CollabService } from '../../../core/services/collab.service';
import { OrgService } from '../../../core/services/org.service';
import {
  Collaborator,
  CollaboratorType,
  CollaboratorUpdateRequest,
} from '../../../shared/models/collaborator.model';

@Component({
  selector: 'app-collab-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './collab-list.html',
  styleUrl: './collab-list.css',
})
export class CollabList implements OnInit {
  private readonly collabService = inject(CollabService);
  private readonly orgService = inject(OrgService);
  readonly authStore = inject(AuthStore);

  readonly collabs = signal<Collaborator[]>([]);
  readonly loading = signal<boolean>(true);
  readonly errorMessage = signal<string>('');
  readonly toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);
  readonly creating = signal<boolean>(false);
  readonly editingCollab = signal<Collaborator | null>(null);
  readonly deletingCollab = signal<Collaborator | null>(null);
  readonly saving = signal<boolean>(false);
  readonly deleting = signal<boolean>(false);
  searchId = '';
  editForm = {
    fullName: '',
    email: '',
    password: '',
    accessLevel: 'OPERATOR' as CollaboratorType,
    organizationId: 0,
  };
  createForm = {
    fullName: '',
    email: '',
    password: '',
    accessLevel: 'OPERATOR' as CollaboratorType,
    organizationId: 0,
  };
  readonly accessLevels: CollaboratorType[] = ['MANAGER', 'OPERATOR'];
  readonly CirclePlus = CirclePlus;
  readonly Eye = Eye;
  readonly Mail = Mail;
  readonly Pencil = Pencil;
  readonly Search = Search;
  readonly Trash2 = Trash2;
  readonly X = X;

  ngOnInit(): void {
    this.loadCollabs();
  }

  loadCollabs(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.collabService.findAll().subscribe({
      next: (response) => {
        this.collabs.set(response);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching collaborators', err);
        this.errorMessage.set('Nao foi possivel carregar os colaboradores.');
        this.loading.set(false);
      },
    });
  }

  searchById(): void {
    if (!this.authStore.canViewAllRecords()) {
      return;
    }

    const id = Number(this.searchId);
    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage.set('Informe um ID valido para buscar.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.collabService.findById(id).subscribe({
      next: (response) => {
        this.collabs.set([response]);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching collaborator by id', err);
        this.collabs.set([]);
        this.errorMessage.set('Nenhum colaborador encontrado para esse ID.');
        this.loading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.searchId = '';
    this.loadCollabs();
  }

  openCreate(): void {
    if (!this.authStore.canManageRecords()) {
      return;
    }

    this.createForm = {
      fullName: '',
      email: '',
      password: '',
      accessLevel: 'OPERATOR',
      organizationId: this.authStore.organizationId() ?? 0,
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
      fullName: this.createForm.fullName.trim(),
      email: this.createForm.email.trim(),
      password: this.createForm.password,
      accessLevel: this.createForm.accessLevel,
      organizationId: Number(this.createForm.organizationId),
    };

    if (
      !payload.fullName ||
      !payload.email ||
      !payload.password ||
      !Number.isInteger(payload.organizationId) ||
      payload.organizationId <= 0
    ) {
      this.showToast('error', 'Preencha nome, email, senha e organizacao.');
      return;
    }

    this.saving.set(true);
    this.collabService.create(payload).subscribe({
      next: (created) => {
        this.collabs.update((items) => [created, ...items]);
        this.saving.set(false);
        this.creating.set(false);
        this.showToast('success', 'Colaborador criado com sucesso.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating collaborator', err);
        this.saving.set(false);
        this.showToast('error', 'Nao foi possivel criar o colaborador.');
      },
    });
  }

  openEdit(collab: Collaborator): void {
    if (!this.authStore.canManageRecords()) {
      return;
    }

    this.editingCollab.set(collab);
    this.editForm = {
      fullName: collab.fullName,
      email: collab.email,
      password: '',
      accessLevel: collab.accessLevel,
      organizationId: collab.organizationId,
    };
  }

  closeEdit(): void {
    if (!this.saving()) {
      this.editingCollab.set(null);
    }
  }

  saveEdit(): void {
    const collab = this.editingCollab();
    if (!collab || !this.authStore.canManageRecords()) {
      return;
    }

    const payload: CollaboratorUpdateRequest = {};
    const fullName = this.editForm.fullName.trim();
    const email = this.editForm.email.trim();
    const password = this.editForm.password.trim();
    const organizationId = Number(this.editForm.organizationId);

    if (!fullName || !email) {
      this.showToast('error', 'Nome e email sao obrigatorios.');
      return;
    }

    if (fullName !== collab.fullName) {
      payload.fullName = fullName;
    }

    if (email !== collab.email) {
      payload.email = email;
    }

    if (password) {
      payload.password = password;
    }

    if (this.editForm.accessLevel !== collab.accessLevel) {
      payload.accessLevel = this.editForm.accessLevel;
    }

    if (!Number.isInteger(organizationId) || organizationId <= 0) {
      this.showToast('error', 'Informe uma organizacao valida.');
      return;
    }

    if (organizationId !== collab.organizationId) {
      this.saving.set(true);
      this.orgService.findById(organizationId).subscribe({
        next: (organization) => {
          payload.organization = organization;
          this.updateCollab(collab.id, payload);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching organization for collaborator update', err);
          this.saving.set(false);
          this.showToast('error', 'Organizacao informada nao foi encontrada.');
        },
      });
      return;
    }

    if (Object.keys(payload).length === 0) {
      this.showToast('error', 'Altere ao menos um campo antes de salvar.');
      return;
    }

    this.saving.set(true);
    this.updateCollab(collab.id, payload);
  }

  openDelete(collab: Collaborator): void {
    if (!this.authStore.canManageRecords()) {
      return;
    }

    this.deletingCollab.set(collab);
  }

  closeDelete(): void {
    if (!this.deleting()) {
      this.deletingCollab.set(null);
    }
  }

  confirmDelete(): void {
    const collab = this.deletingCollab();
    if (!collab || !this.authStore.canManageRecords()) {
      return;
    }

    this.deleting.set(true);
    this.collabService.delete(collab.id).subscribe({
      next: () => {
        this.collabs.update((items) => items.filter((item) => item.id !== collab.id));
        this.deleting.set(false);
        this.deletingCollab.set(null);
        this.showToast('success', 'Colaborador excluido com sucesso.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error deleting collaborator', err);
        this.deleting.set(false);
        this.showToast('error', 'Nao foi possivel excluir o colaborador.');
      },
    });
  }

  initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return 'U';
    }

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }

  accessLevelClass(accessLevel: CollaboratorType): string {
    return `role-badge--${accessLevel.toLowerCase()}`;
  }

  accessLevelLabel(accessLevel: CollaboratorType): string {
    return accessLevel === 'MANAGER' ? 'Manager' : 'Operator';
  }

  get scopeLabel(): string {
    return this.authStore.canViewAllRecords() ? 'Todos os registros' : this.authStore.organizationLabel();
  }

  private updateCollab(id: number, payload: CollaboratorUpdateRequest): void {
    this.collabService.update(id, payload).subscribe({
      next: (updated) => {
        this.collabs.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
        this.saving.set(false);
        this.editingCollab.set(null);
        this.showToast('success', 'Colaborador atualizado com sucesso.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating collaborator', err);
        this.saving.set(false);
        this.showToast('error', 'Nao foi possivel atualizar o colaborador.');
      },
    });
  }

  private showToast(type: 'success' | 'error', message: string): void {
    this.toast.set({ type, message });
    setTimeout(() => this.toast.set(null), 3200);
  }
}
