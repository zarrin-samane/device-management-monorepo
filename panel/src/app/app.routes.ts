import { Route } from '@angular/router';
import { devicesRoutes } from './devices/devices.routes';

export const appRoutes: Route[] = [
  { path: 'devices', children: devicesRoutes },
];
