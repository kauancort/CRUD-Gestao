import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CirclePlus,
  Eye,
  LucideAngularModule,
  Pencil,
  Search,
  Smartphone,
  Tag,
  Trash2,
  X,
} from 'lucide-angular';
import { AuthStore } from '../../../core/auth/auth.store';
import { DeviceService } from '../../../core/services/device.service';
import { Device, DeviceCondition } from '../../../shared/models/device.model';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './device-list.html',
  styleUrl: './device-list.css',
})
export class DeviceList implements OnInit {
  private readonly deviceService = inject(DeviceService);
  readonly authStore = inject(AuthStore);

  readonly devices = signal<Device[]>([]);
  readonly loading = signal<boolean>(true);
  readonly errorMessage = signal<string>('');
  readonly toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);
  readonly editingDevice = signal<Device | null>(null);
  readonly deletingDevice = signal<Device | null>(null);
  readonly creating = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly deleting = signal<boolean>(false);
  searchId = '';
  editCondition: DeviceCondition = 'NEW';
  createForm = {
    model: '',
    assetTag: '',
    condition: 'NEW' as DeviceCondition,
    organizationId: 0,
  };
  readonly conditions: DeviceCondition[] = ['NEW', 'USED', 'BROKEN'];
  readonly CirclePlus = CirclePlus;
  readonly Eye = Eye;
  readonly Pencil = Pencil;
  readonly Search = Search;
  readonly Smartphone = Smartphone;
  readonly Tag = Tag;
  readonly Trash2 = Trash2;
  readonly X = X;

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.deviceService.findAll().subscribe({
      next: (response) => {
        this.devices.set(response);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching devices', err);
        this.errorMessage.set('Nao foi possivel carregar os dispositivos.');
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

    this.deviceService.findById(id).subscribe({
      next: (response) => {
        this.devices.set([response]);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching device by id', err);
        this.devices.set([]);
        this.errorMessage.set('Nenhum device encontrado para esse ID.');
        this.loading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.searchId = '';
    this.loadDevices();
  }

  openCreate(): void {
    if (!this.authStore.canManageRecords()) {
      return;
    }

    this.createForm = {
      model: '',
      assetTag: '',
      condition: 'NEW',
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
      model: this.createForm.model.trim(),
      assetTag: this.createForm.assetTag.trim(),
      condition: this.createForm.condition,
      organizationId: Number(this.createForm.organizationId),
    };

    if (!payload.model || !payload.assetTag || !Number.isInteger(payload.organizationId) || payload.organizationId <= 0) {
      this.showToast('error', 'Preencha modelo, asset tag e organizacao.');
      return;
    }

    this.saving.set(true);
    this.deviceService.create(payload).subscribe({
      next: (created) => {
        this.devices.update((items) => [created, ...items]);
        this.saving.set(false);
        this.creating.set(false);
        this.showToast('success', 'Device criado com sucesso.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating device', err);
        this.saving.set(false);
        this.showToast('error', 'Nao foi possivel criar o device.');
      },
    });
  }

  openEdit(device: Device): void {
    if (!this.authStore.canManageRecords()) {
      return;
    }

    this.editingDevice.set(device);
    this.editCondition = device.condition;
  }

  closeEdit(): void {
    if (!this.saving()) {
      this.editingDevice.set(null);
    }
  }

  saveEdit(): void {
    const device = this.editingDevice();
    if (!device || !this.authStore.canManageRecords()) {
      return;
    }

    if (this.editCondition === device.condition) {
      this.showToast('error', 'Altere o status antes de salvar.');
      return;
    }

    this.saving.set(true);
    this.deviceService.update(device.id, { condition: this.editCondition }).subscribe({
      next: (updated) => {
        this.devices.update((items) => items.map((item) => (item.id === updated.id ? updated : item)));
        this.saving.set(false);
        this.editingDevice.set(null);
        this.showToast('success', 'Device atualizado com sucesso.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating device', err);
        this.saving.set(false);
        this.showToast('error', 'Nao foi possivel atualizar o device.');
      },
    });
  }

  openDelete(device: Device): void {
    if (!this.authStore.canManageRecords()) {
      return;
    }

    this.deletingDevice.set(device);
  }

  closeDelete(): void {
    if (!this.deleting()) {
      this.deletingDevice.set(null);
    }
  }

  confirmDelete(): void {
    const device = this.deletingDevice();
    if (!device || !this.authStore.canManageRecords()) {
      return;
    }

    this.deleting.set(true);
    this.deviceService.delete(device.id).subscribe({
      next: () => {
        this.devices.update((items) => items.filter((item) => item.id !== device.id));
        this.deleting.set(false);
        this.deletingDevice.set(null);
        this.showToast('success', 'Device excluido com sucesso.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error deleting device', err);
        this.deleting.set(false);
        this.showToast('error', 'Nao foi possivel excluir o device.');
      },
    });
  }

  conditionClass(condition: DeviceCondition): string {
    return `status-badge--${condition.toLowerCase()}`;
  }

  conditionLabel(condition: DeviceCondition): string {
    const labels: Record<string, string> = {
      NEW: 'Novo',
      USED: 'Usado',
      BROKEN: 'Quebrado',
    };

    return labels[condition] ?? condition;
  }

  get scopeLabel(): string {
    return this.authStore.canViewAllRecords() ? 'Todos os devices' : this.authStore.organizationLabel();
  }

  private showToast(type: 'success' | 'error', message: string): void {
    this.toast.set({ type, message });
    setTimeout(() => this.toast.set(null), 3200);
  }
}
