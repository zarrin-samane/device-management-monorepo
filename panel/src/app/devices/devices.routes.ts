import { Route } from '@angular/router';
import { DeviceListPageComponent } from './device-list-page/device-list-page.component';

export const devicesRoutes: Route[] = [
  { path: '', component: DeviceListPageComponent },
];
