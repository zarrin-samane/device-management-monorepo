import { FlexLayoutModule } from '@angular/flex-layout';
import { ConnectionStatusPipe } from './pipes/connection-status.pipe';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component';
import { FileUrlPipe } from './pipes/file-url.pipe';

export const SHARED = [
  FlexLayoutModule,
  ConnectionStatusPipe,
  FileUrlPipe,
  AlertDialogComponent,
  PromptDialogComponent,
];
