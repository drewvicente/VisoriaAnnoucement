import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

import { ReminderService } from '../../services/reminder.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.page.html',
  styleUrls: ['./reminders.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, DatePipe, RouterLink],
})
export class RemindersPage {
  protected readonly reminders = inject(ReminderService);

  async cancel(noticeId: string): Promise<void> {
    await this.reminders.cancel(noticeId);
  }
}
