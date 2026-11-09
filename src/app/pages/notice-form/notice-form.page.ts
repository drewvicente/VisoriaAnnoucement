import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToggle,
  IonToolbar,
  NavController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, close, locationOutline, warningOutline } from 'ionicons/icons';

import { LogoComponent } from '../../components/logo/logo.component';
import { APP_CONFIG } from '../../core/app-config';
import { NoticeService } from '../../services/notice.service';
import { UiService } from '../../services/ui.service';

// One page for both "New notice" (/new) and "Edit notice" (/edit/:id).
@Component({
  selector: 'app-notice-form',
  templateUrl: './notice-form.page.html',
  styleUrls: ['./notice-form.page.scss'],
  imports: [
    FormsModule, IonBackButton, IonButtons, IonContent, IonHeader, IonIcon,
    IonTitle, IonToggle, IonToolbar, LogoComponent,
  ],
})
export class NoticeFormPage {
  private readonly route = inject(ActivatedRoute);
  private readonly noticeService = inject(NoticeService);
  private readonly ui = inject(UiService);
  private readonly nav = inject(NavController);
  private readonly alertCtrl = inject(AlertController);

  protected readonly config = APP_CONFIG;
  private readonly id: string | null = this.route.snapshot.paramMap.get('id');
  protected readonly isEdit = this.id !== null;

  protected title = '';
  protected body = '';
  protected important = false;
  protected eventDate = ''; // 'YYYY-MM-DDTHH:mm'
  protected location = '';
  protected customTag = '';

  protected readonly tag = signal('Notice');
  protected readonly customOpen = signal(false);

  // the 4 default tags, plus the custom one once the admin types it
  protected readonly tagOptions = computed((): string[] => {
    const t = this.tag();
    const defaults = APP_CONFIG.defaultTags;
    return defaults.includes(t) ? [...defaults] : [...defaults, t];
  });

  constructor() {
    addIcons({ calendarOutline, close, locationOutline, warningOutline });

    if (this.id) {
      const n = this.noticeService.getById(this.id);
      if (!n) {
        void this.nav.navigateRoot('/posts');
        return;
      }
      this.title = n.title;
      this.body = n.body;
      this.important = n.important;
      this.eventDate = n.eventDate ?? '';
      this.location = n.location ?? '';
      this.tag.set(n.tag);
      if (!APP_CONFIG.defaultTags.includes(n.tag)) {
        this.customTag = n.tag;
      }
    }
  }

  pickTag(t: string): void {
    this.tag.set(t);
    if (APP_CONFIG.defaultTags.includes(t)) {
      this.customOpen.set(false);
    }
  }

  toggleCustom(): void {
    this.customOpen.update(open => !open);
  }

  onCustomTag(value: string): void {
    this.tag.set(value.trim() || 'Notice');
  }

  clearDate(): void {
    this.eventDate = '';
  }

  async save(): Promise<void> {
    const title = this.title.trim();
    if (!title) {
      await this.ui.toast('Please enter a notice title.');
      return;
    }

    const data = {
      title,
      body: this.body.trim(),
      tag: this.tag().trim() || 'Notice',
      important: this.important,
      eventDate: this.eventDate || undefined,
      location: this.location.trim() || undefined,
    };

    if (this.id) {
      this.noticeService.update(this.id, data);
      await this.ui.toast('Changes saved');
      await this.nav.navigateRoot('/posts');
    } else {
      this.noticeService.add(data);
      await this.ui.toast('Notice posted');
      await this.nav.navigateRoot('/feed');
    }
  }

  async confirmDelete(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Delete notice?',
      message: 'Residents will no longer see it. This cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role === 'destructive' && this.id) {
      this.noticeService.remove(this.id);
      await this.ui.toast('Notice deleted');
      await this.nav.navigateRoot('/posts');
    }
  }
}
