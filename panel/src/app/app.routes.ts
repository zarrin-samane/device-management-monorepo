import { Route } from '@angular/router';
import { devicesRoutes } from './devices/devices.routes';
import { filesRoutes } from './files/files.routes';

export const appRoutes: Route[] = [
  { path: 'devices', children: devicesRoutes },
  { path: 'files', children: filesRoutes },
  { path: '', redirectTo: 'devices', pathMatch: 'full' },
];
