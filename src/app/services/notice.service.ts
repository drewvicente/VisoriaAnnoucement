import { Injectable, computed, signal } from '@angular/core';
import { loadData, saveData } from '../core/local-store';
import { Notice } from '../models/notice.model';

const KEY = 'barangay.notices';

@Injectable({ providedIn: 'root' })
export class NoticeService {
  // Starts empty: no sample data.
  private readonly _notices = signal<Notice[]>(loadData<Notice[]>(KEY, []));

  readonly notices = this._notices.asReadonly();

  // newest first
  readonly sorted = computed((): Notice[] =>
    [...this._notices()].sort((a, b) => b.postedAt.localeCompare(a.postedAt))
  );

  getById(id: string): Notice | undefined {
    return this._notices().find(n => n.id === id);
  }

  add(data: Omit<Notice, 'id' | 'postedAt'>): Notice {
    const notice: Notice = {
      ...data,
      id: Date.now().toString(),
      postedAt: new Date().toISOString(),
    };
    this._notices.update((list): Notice[] => [notice, ...list]);
    this.persist();
    return notice;
  }

  update(id: string, changes: Partial<Notice>): void {
    this._notices.update((list): Notice[] =>
      list.map(n => (n.id === id ? { ...n, ...changes } : n))
    );
    this.persist();
  }

  remove(id: string): void {
    this._notices.update((list): Notice[] => list.filter(n => n.id !== id));
    this.persist();
  }

  private persist(): void {
    saveData(KEY, this._notices());
  }
}
