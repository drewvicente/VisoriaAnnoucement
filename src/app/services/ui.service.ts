import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class UiService {
  private readonly toastCtrl = inject(ToastController);

  async toast(message: string): Promise<void> {
    const t = await this.toastCtrl.create({ message, duration: 2200, position: 'top' });
    await t.present();
  }
}
