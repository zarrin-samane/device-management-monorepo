import { Route } from '@angular/router';
import { devicesRoutes } from './devices/devices.routes';
import { filesRoutes } from './files/files.routes';
import { authRoutes } from './auth/auth.routes';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Route[] = [
  { path: 'login', children: authRoutes },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'devices', children: devicesRoutes },
      { path: 'files', children: filesRoutes },
      { path: '', redirectTo: 'devices', pathMatch: 'full' },
    ],
  },
];
