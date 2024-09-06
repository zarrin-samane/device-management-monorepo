import { FlexLayoutModule } from '@angular/flex-layout';
import { ConnectionStatusPipe } from './pipes/connection-status.pipe';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';

export const SHARED = [FlexLayoutModule, ConnectionStatusPipe, AlertDialogComponent];
