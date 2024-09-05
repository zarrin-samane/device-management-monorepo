import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SHARED } from '../../shared';
import { DeviceFormDialogComponent } from '../device-form-dialog/device-form-dialog.component';
import { TableComponent } from './table/table.component';
import { Device } from '@device-management/types';

@Component({
  selector: 'app-device-list-page',
  standalone: true,
  imports: [
    CommonModule,
    SHARED,
    MatToolbarModule,
    MatButtonModule,
    TableComponent,
    MatDividerModule,
    MatProgressSpinner,
  ],
  templateUrl: './device-list-page.component.html',
  styleUrl: './device-list-page.component.scss',
})
export class DeviceListPageComponent {
  query = injectQuery(() => ({
    queryKey: ['devices'],
    queryFn: () => lastValueFrom(this.http.get<Device[]>(`/devices`)),
  }));

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  openFormDialog() {
    this.dialog.open(DeviceFormDialogComponent);
  }
}
