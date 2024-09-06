import { FlexLayoutModule } from '@angular/flex-layout';
import { ConnectionStatusPipe } from './pipes/connection-status.pipe';

export const SHARED = [FlexLayoutModule, ConnectionStatusPipe];
