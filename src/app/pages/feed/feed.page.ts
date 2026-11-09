import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonFab, IonHeader, IonIcon, NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  add,
  checkmarkCircle,
  chevronForward,
  homeOutline,
  lockClosedOutline,
  logOutOutline,
  notificationsOutline,
  searchOutline,
  warningOutline,
} from 'ionicons/icons';

import { LogoComponent } from '../../components/logo/logo.component';
import { APP_CONFIG } from '../../core/app-config';
import type { Notice } from '../../models/notice.model';
import { AuthService } from '../../services/auth.service';
import { NoticeService } from '../../services/notice.service';
import { ReminderService } from '../../services/reminder.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonContent, IonFab, IonHeader, IonIcon, DatePipe, RouterLink, LogoComponent],
})
export class FeedPage {
  protected readonly auth = inject(AuthService);
  protected readonly reminders = inject(ReminderService);
  private readonly noticeService = inject(NoticeService);
  private readonly ui = inject(UiService);
  private readonly nav = inject(NavController);

  protected readonly config = APP_CONFIG;
  protected readonly searchTerm = signal('');
  private readonly selectedTag = signal('All');

  // "All" + every tag in use (custom tags show up automatically)
  protected readonly tags = computed((): string[] => [
    'All',
    ...new Set(this.noticeService.sorted().map(n => n.tag)),
  ]);

  // if the selected tag disappears (notice deleted), fall back to All
  protected readonly activeTag = computed((): string =>
    this.tags().includes(this.selectedTag()) ? this.selectedTag() : 'All'
  );

  protected readonly importantNotice = computed((): Notice | undefined =>
    this.noticeService.sorted().find(n => n.important)
  );

  protected readonly filtered = computed((): Notice[] => {
    const term = this.searchTerm().toLowerCase().trim();
    const tag = this.activeTag();
    return this.noticeService
      .sorted()
      .filter(n => tag === 'All' || n.tag === tag)
      .filter(
        n => !term || n.title.toLowerCase().includes(term) || n.body.toLowerCase().includes(term)
      );
  });

  constructor() {
    addIcons({
      add,
      checkmarkCircle,
      chevronForward,
      homeOutline,
      lockClosedOutline,
      logOutOutline,
      notificationsOutline,
      searchOutline,
      warningOutline,
    });
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  selectTag(tag: string): void {
    this.selectedTag.set(tag);
  }

  importantLabel(n: Notice): string {
    const today = new Date(n.postedAt).toDateString() === new Date().toDateString();
    return today ? 'IMPORTANT · TODAY' : 'IMPORTANT';
  }

  async remind(notice: Notice, event: Event): Promise<void> {
    event.stopPropagation(); // don't open the notice
    await this.ui.toast(await this.reminders.toggle(notice));
  }

  logout(): void {
    this.auth.logout();
    void this.nav.navigateRoot('/login');
  }
}