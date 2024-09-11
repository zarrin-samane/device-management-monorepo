import { Route } from '@angular/router';
import { FileListPageComponent } from './file-list-page/file-list-page.component';

export const filesRoutes: Route[] = [
  { path: '', component: FileListPageComponent },
];
