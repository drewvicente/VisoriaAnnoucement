import { formatDate } from '@angular/common';
import { Injectable, computed, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

import { APP_CONFIG } from '../core/app-config';
import { loadData, saveData } from '../core/local-store';
import type { Notice, Reminder } from '../models/notice.model';

const KEY = 'barangay.reminders';
type AddResult = 'ok' | 'past' | 'no-date' | 'denied';

// Reminders are saved on the resident's own phone, so residents need no account.
@Injectable({ providedIn: 'root' })
export class ReminderService {
  private readonly _list = signal<Reminder[]>(this.loadUpcoming());

  readonly list = computed((): Reminder[] =>
    [...this._list()].sort((a, b) => a.remindAt.localeCompare(b.remindAt))
  );
  readonly count = computed((): number => this._list().length);

  has(noticeId: string): boolean {
    return this._list().some(r => r.noticeId === noticeId);
  }

  // Tap once to set, tap again to cancel. Returns a message to show in a toast.
  async toggle(notice: Notice): Promise<string> {
    if (this.has(notice.id)) {
      await this.cancel(notice.id);
      return 'Reminder cancelled';
    }
    const result = await this.add(notice);
    switch (result) {
      case 'ok':
        return 'Reminder set for 1 day before';
      case 'past':
        return 'Too late to set a reminder for this event';
      case 'no-date':
        return 'This notice has no event date';
      default:
        return 'Allow notifications to get reminders';
    }
  }

  async cancel(noticeId: string): Promise<void> {
    const found = this._list().find(r => r.noticeId === noticeId);
    if (!found) {
      return;
    }
    this._list.update((list): Reminder[] => list.filter(r => r.noticeId !== noticeId));
    saveData(KEY, this._list());

    if (Capacitor.isNativePlatform()) {
      try {
        await LocalNotifications.cancel({ notifications: [{ id: found.notificationId }] });
      } catch {
        // nothing to cancel
      }
    }
  }

  private async add(notice: Notice): Promise<AddResult> {
    if (!notice.eventDate) {
      return 'no-date';
    }
    const remindAt = this.computeRemindAt(notice.eventDate);
    if (remindAt.getTime() <= Date.now()) {
      return 'past';
    }

    const notificationId = Math.floor(Math.random() * 2_000_000_000) + 1;

    // Real phone notification only works inside the Android app.
    // In the browser the reminder is saved but nothing pops up.
    if (Capacitor.isNativePlatform()) {
      try {
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display !== 'granted') {
          return 'denied';
        }
        const time = formatDate(notice.eventDate, 'h:mm a', 'en-US');
        const place = notice.location ? ` at ${notice.location}` : '';
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notificationId,
              title: APP_CONFIG.shortName,
              body: `${notice.title} is tomorrow, ${time}${place}`,
              schedule: { at: remindAt, allowWhileIdle: true },
            },
          ],
        });
      } catch {
        return 'denied';
      }
    }

    const reminder: Reminder = {
      noticeId: notice.id,
      title: notice.title,
      eventDate: notice.eventDate,
      remindAt: remindAt.toISOString(),
      notificationId,
    };
    this._list.update((list): Reminder[] => [...list, reminder]);
    saveData(KEY, this._list());
    return 'ok';
  }

  private computeRemindAt(eventDate: string): Date {
    const d = new Date(eventDate);
    d.setMinutes(d.getMinutes() - APP_CONFIG.reminderMinutesBefore);
    return d;
  }

  // forget reminders whose event already happened
  private loadUpcoming(): Reminder[] {
    const all = loadData<Reminder[]>(KEY, []);
    const upcoming = all.filter(r => new Date(r.eventDate).getTime() > Date.now());
    if (upcoming.length !== all.length) {
      saveData(KEY, upcoming);
    }
    return upcoming;
  }
}
