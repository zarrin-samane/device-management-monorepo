import { Component, computed } from '@angular/core';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

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
    ReactiveFormsModule,
  ],
  templateUrl: './device-list-page.component.html',
  styleUrl: './device-list-page.component.scss',
})
export class DeviceListPageComponent {
  searchControl = new FormControl('');
  searchText = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  query = injectQuery(() => ({
    queryKey: ['devices'],
    queryFn: () => lastValueFrom(this.http.get<Device[]>(`/devices`)),
  }));

  data = computed(() => {
    const searchText = this.searchText();
    const data = this.query.data();
    if (searchText && data) {
      return data.filter(
        (x) =>
          x.serial.search(searchText) > -1 || x.title.search(searchText) > -1,
      );
    }
    return data;
  });

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
  ) {}

  openFormDialog(isRange?: boolean) {
    this.dialog.open(DeviceFormDialogComponent, { data: { isRange } });
  }
}
