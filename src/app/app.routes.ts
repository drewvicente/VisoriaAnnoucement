import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: '',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./pages/feed/feed.page').then(m => m.FeedPage),
      },
      {
        path: 'reminders',
        loadComponent: () => import('./pages/reminders/reminders.page').then(m => m.RemindersPage),
      },
      {
        path: 'posts',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/my-posts/my-posts.page').then(m => m.MyPostsPage),
      },
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
    ],
  },
  {
    path: 'notice/:id',
    loadComponent: () =>
      import('./pages/notice-detail/notice-detail.page').then(m => m.NoticeDetailPage),
  },
  {
    path: 'new',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/notice-form/notice-form.page').then(m => m.NoticeFormPage),
  },
  {
    path: 'edit/:id',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/notice-form/notice-form.page').then(m => m.NoticeFormPage),
  },
  { path: '**', redirectTo: '' },
];
