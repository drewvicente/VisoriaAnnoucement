import { Component, Input, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline } from 'ionicons/icons';

import { APP_CONFIG } from '../../core/app-config';

// Shows the barangay logo. If the image file is missing, shows a house icon instead.
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [IonIcon],
  template: `
    <div class="logo" [style.width.px]="size" [style.height.px]="size">
      @if (!failed()) {
        <img [src]="src" alt="Barangay logo" (error)="failed.set(true)" />
      } @else {
        <ion-icon name="home-outline" [style.fontSize.px]="size * 0.5"></ion-icon>
      }
    </div>
  `,
  styles: [
    `
      :host { display: inline-block; flex-shrink: 0; line-height: 0; }
      .logo {
        border-radius: 50%;
        background: #fff;
        display: grid;
        place-items: center;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0.08);
      }
      img { width: 100%; height: 100%; object-fit: contain; }
      ion-icon { color: #0037a6; }
    `,
  ],
})
export class LogoComponent {
  @Input() size = 44;
  protected readonly src = APP_CONFIG.logoUrl;
  protected readonly failed = signal(false);

  constructor() {
    addIcons({ homeOutline });
  }
}
