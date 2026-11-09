import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, locationOutline, notificationsOutline, pencilOutline } from 'ionicons/icons';

import { LogoComponent } from '../../components/logo/logo.component';
import { APP_CONFIG } from '../../core/app-config';
import type { Notice } from '../../models/notice.model';
import { AuthService } from '../../services/auth.service';
import { NoticeService } from '../../services/notice.service';
import { ReminderService } from '../../services/reminder.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-notice-detail',
  templateUrl: './notice-detail.page.html',
  styleUrls: ['./notice-detail.page.scss'],
  standalone: true,
  imports: [
    IonBackButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonTitle, IonToolbar,
    DatePipe, RouterLink, LogoComponent,
  ],
})
export class NoticeDetailPage {
  protected readonly auth = inject(AuthService);
  protected readonly reminders = inject(ReminderService);
  private readonly noticeService = inject(NoticeService);
  private readonly ui = inject(UiService);
  private readonly route = inject(ActivatedRoute);

  protected readonly config = APP_CONFIG;
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  // reads from the service, so edits by the admin show up right away
  protected readonly notice = computed((): Notice | undefined => this.noticeService.getById(this.id));

  constructor() {
    addIcons({ calendarOutline, locationOutline, notificationsOutline, pencilOutline });
  }

  async remind(): Promise<void> {
    const n = this.notice();
    if (n) {
      await this.ui.toast(await this.reminders.toggle(n));
    }
  }
}
