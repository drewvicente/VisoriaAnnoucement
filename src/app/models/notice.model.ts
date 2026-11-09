export interface Notice {
  id: string;
  title: string;
  body: string;
  tag: string; // Notice, Event, Alert, Program or a custom tag like "Lost pet"
  important: boolean; // shows the red banner on the feed
  postedAt: string; // ISO date
  eventDate?: string; // 'YYYY-MM-DDTHH:mm' (local time), only for events
  location?: string;
}

export interface Reminder {
  noticeId: string;
  title: string;
  eventDate: string;
  remindAt: string; // ISO date
  notificationId: number;
}
