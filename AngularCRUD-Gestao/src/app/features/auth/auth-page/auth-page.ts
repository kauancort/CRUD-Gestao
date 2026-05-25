import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, AlertCircle, CheckCircle2, X } from 'lucide-angular';
import { finalize, of, switchMap, tap, timeout } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthStore } from '../../../core/auth/auth.store';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterRole,
} from '../../../shared/models/auth.model';

interface RegisterFormData extends Omit<RegisterRequest, 'accessLevel'> {
  accessLevel: RegisterRole | '';
}

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPageComponent {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  isLogin = true;
  loading = false;
  successMessage = '';
  errorMessages: string[] = [];
  toast: { type: 'success' | 'error'; message: string } | null = null;
  private toastId = 0;

  readonly AlertCircle = AlertCircle;
  readonly CheckCircle2 = CheckCircle2;
  readonly X = X;

  loginData: LoginRequest = {
    email: '',
    password: '',
  };

  registerData: RegisterFormData = {
    fullName: '',
    email: '',
    password: '',
    accessLevel: '',
    organizationId: 0,
  };

  switchMode(login: boolean): void {
    if (this.loading) {
      return;
    }

    this.isLogin = login;
    this.clearFeedback();
  }

  switchToLoginAfterRegister(): void {
    this.isLogin = true;
    this.errorMessages = [];
  }

  onLogin(): void {
    this.clearFeedback();

    if (!this.loginData.email || !this.loginData.password) {
      this.setErrors(['Preencha todos os campos.']);
      return;
    }

    this.loading = true;

    this.authService
      .login(this.loginData)
      .pipe(
        timeout({ first: 15000 }),
        switchMap((response) => {
          this.storeLoginResponse(response);
          return response.user
            ? of(response.user)
            : this.authService.resolveCurrentUser(this.loginData.email);
        }),
        tap((user) => {
          this.authStore.setCurrentUser(user);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Login realizado com sucesso!';
          this.showToast('success', 'Login realizado com sucesso!');
          setTimeout(() => this.router.navigate(['/dashboard']), 500);
        },
        error: (error: unknown) => {
          this.authStore.clearAuth();
          this.handleAuthError(error, 'Email ou senha inválidos');
        },
      });
  }

  onRegister(registerForm?: NgForm): void {
    this.clearFeedback();

    const validationMessage = this.getRegisterValidationMessage();
    if (validationMessage) {
      this.setErrors([validationMessage]);
      return;
    }

    this.loading = true;

    const payload: RegisterRequest = {
      fullName: this.registerData.fullName.trim(),
      email: this.registerData.email.trim(),
      password: this.registerData.password,
      accessLevel: this.registerData.accessLevel as RegisterRole,
      organizationId: Number(this.registerData.organizationId),
    };

    this.authService
      .register(payload)
      .pipe(
        timeout({ first: 15000 }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.successMessage = 'Cadastro criado com sucesso!';
          this.showToast('success', 'Cadastro criado com sucesso!');
          this.resetRegisterForm(registerForm);
          setTimeout(() => this.switchToLoginAfterRegister(), 1200);
        },
        error: (error: unknown) => {
          this.handleAuthError(error, 'Erro inesperado ao criar cadastro.');
        },
      });
  }

  dismissToast(): void {
    this.toast = null;
  }

  private storeLoginResponse(response: AuthResponse): void {
    if (response.user) {
      this.authStore.setToken(response.token, response.user);
      return;
    }

    this.authStore.setToken(response.token);
  }

  private isRegisterRole(role: RegisterRole | ''): role is RegisterRole {
    return role === 'MANAGER' || role === 'OPERATOR';
  }

  private getRegisterValidationMessage(): string {
    if (!this.registerData.fullName.trim()) {
      return 'Informe o nome completo.';
    }

    if (!this.registerData.email.trim()) {
      return 'Informe o e-mail.';
    }

    if (!this.isValidEmail(this.registerData.email)) {
      return 'Informe um e-mail válido.';
    }

    if (!this.registerData.password) {
      return 'Informe a senha.';
    }

    if (!this.isRegisterRole(this.registerData.accessLevel)) {
      return 'Selecione o tipo de acesso.';
    }

    const organizationId = Number(this.registerData.organizationId);
    if (!Number.isInteger(organizationId) || organizationId <= 0) {
      return 'Informe um ID de organização válido.';
    }

    return '';
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  private handleAuthError(error: unknown, fallback: string): void {
    this.setErrors(this.getHttpErrorMessages(error, fallback));
  }

  private getHttpErrorMessages(error: unknown, fallback: string): string[] {
    if (!(error instanceof HttpErrorResponse)) {
      return ['Tempo esgotado ou erro de conexão. Tente novamente.'];
    }

    const payloadMessages = this.getPayloadErrorMessages(error.error);
    if (payloadMessages.length > 0) {
      return payloadMessages;
    }

    if (error.status === 0) {
      return ['Não foi possível conectar com o servidor. Verifique se a API está rodando.'];
    }

    if (error.status === 400) {
      return ['Dados inválidos. Confira os campos e tente novamente.'];
    }

    if (error.status === 401 || error.status === 403) {
      return ['Email ou senha inválidos'];
    }

    if (error.status === 409) {
      return ['Email já cadastrado'];
    }

    return [fallback];
  }

  private getPayloadErrorMessages(payload: unknown): string[] {
    const normalizedPayload = this.parsePayload(payload);

    if (this.hasErrors(normalizedPayload)) {
      return this.sanitizeMessages(normalizedPayload.errors);
    }

    if (this.hasMessage(normalizedPayload)) {
      return this.sanitizeMessages([normalizedPayload.message]);
    }

    if (typeof normalizedPayload === 'string') {
      return this.sanitizeMessages([normalizedPayload]);
    }

    return [];
  }

  private parsePayload(payload: unknown): unknown {
    if (typeof payload !== 'string') {
      return payload;
    }

    try {
      return JSON.parse(payload) as unknown;
    } catch {
      return payload;
    }
  }

  private sanitizeMessages(messages: string[]): string[] {
    return messages
      .map((message) => message.trim())
      .filter((message) => message.length > 0 && !this.isTechnicalBackendMessage(message));
  }

  private resetRegisterForm(registerForm?: NgForm): void {
    this.registerData = {
      fullName: '',
      email: '',
      password: '',
      accessLevel: '',
      organizationId: 0,
    };

    registerForm?.resetForm(this.registerData);
  }

  private clearFeedback(): void {
    this.successMessage = '';
    this.errorMessages = [];
    this.toast = null;
  }

  private setErrors(messages: string[]): void {
    const sanitizedMessages = this.sanitizeMessages(messages);

    this.successMessage = '';
    this.errorMessages = sanitizedMessages.length ? sanitizedMessages : ['Erro inesperado. Tente novamente.'];
    this.showToast('error', this.errorMessages.join(' | '));
  }

  private showToast(type: 'success' | 'error', message: string): void {
    const currentToastId = ++this.toastId;
    this.toast = { type, message };

    setTimeout(() => {
      if (this.toastId === currentToastId) {
        this.toast = null;
      }
    }, 3600);
  }

  private isTechnicalBackendMessage(message: string): boolean {
    return /JSON parse error|HttpMessageNotReadableException|creator parameter/i.test(message);
  }

  private hasMessage(value: unknown): value is { message: string } {
    return (
      typeof value === 'object' &&
      value !== null &&
      'message' in value &&
      typeof value.message === 'string'
    );
  }

  private hasErrors(value: unknown): value is { errors: string[] } {
    return (
      typeof value === 'object' &&
      value !== null &&
      'errors' in value &&
      Array.isArray(value.errors) &&
      value.errors.every((error) => typeof error === 'string')
    );
  }
}
