import { Injectable, signal } from '@angular/core';
import { APP_CONFIG } from '../core/app-config';
import { loadData, saveData } from '../core/local-store';

const KEY = 'barangay.admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isAdmin = signal<boolean>(loadData<boolean>(KEY, false));
  readonly isAdmin = this._isAdmin.asReadonly();

  login(username: string, password: string): boolean {
    const ok = username === APP_CONFIG.adminUsername && password === APP_CONFIG.adminPassword;
    if (ok) {
      this._isAdmin.set(true);
      saveData(KEY, true);
    }
    return ok;
  }

  logout(): void {
    this._isAdmin.set(false);
    saveData(KEY, false);
  }
}
