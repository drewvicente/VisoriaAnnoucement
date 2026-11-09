import { DatePipe, formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonFab, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, homeOutline, pencilOutline, warningOutline } from 'ionicons/icons';

import type { Notice } from '../../models/notice.model';
import { NoticeService } from '../../services/notice.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.page.html',
  styleUrls: ['./my-posts.page.scss'],
  standalone: true,
  imports: [IonContent, IonFab, IonHeader, IonIcon, IonTitle, IonToolbar, DatePipe, RouterLink],
})
export class MyPostsPage {
  protected readonly noticeService = inject(NoticeService);

  constructor() {
    addIcons({ add, homeOutline, pencilOutline, warningOutline });
  }

  meta(n: Notice): string {
    const isToday = new Date(n.postedAt).toDateString() === new Date().toDateString();
    const when = isToday ? 'Today' : `Posted ${formatDate(n.postedAt, 'MMM d', 'en-US')}`;
    return n.important ? `${n.tag} · Important · ${when}` : `${n.tag} · ${when}`;
  }
}
