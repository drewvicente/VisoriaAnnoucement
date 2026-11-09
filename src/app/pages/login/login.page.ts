import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, NavController } from '@ionic/angular';

import { LogoComponent } from '../../components/logo/logo.component';
import { APP_CONFIG } from '../../core/app-config';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, FormsModule, LogoComponent],
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);

  protected readonly config = APP_CONFIG;
  protected username = '';
  protected password = '';
  protected readonly error = signal('');

  signIn(): void {
    if (this.auth.login(this.username.trim(), this.password)) {
      this.error.set('');
      void this.nav.navigateRoot('/feed');
    } else {
      this.error.set('Incorrect username or password.');
    }
  }

  continueAsResident(): void {
    void this.nav.navigateRoot('/feed');
  }
}
