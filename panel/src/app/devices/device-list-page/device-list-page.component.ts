import { Component, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
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
import { MatIconModule } from '@angular/material/icon';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatIconModule,
  ],
  templateUrl: './device-list-page.component.html',
  styleUrl: './device-list-page.component.scss',
})
export class DeviceListPageComponent {
  searchControl = new FormControl('');
  @ViewChild(TableComponent) table: TableComponent;
  searchText = toSignal(this.searchControl.valueChanges, { initialValue: '' });
  selectedIds = signal<string[]>([]);
  selectedDevices = computed(() => {
    const selectedIds = this.selectedIds();
    return this.data()?.filter((x) => selectedIds.includes(x._id));
  });
  hasSelection = computed(() => {
    return this.selectedIds().length > 0;
  });

  query = injectQuery(() => ({
    queryKey: ['devices'],
    queryFn: () => lastValueFrom(this.http.get<Device[]>(`/devices`)),
    refetchInterval: 20000,
  }));

  removeMutation = injectMutation((client) => ({
    mutationFn: (dto: Device[]) =>
      lastValueFrom(
        this.http.delete('/devices', {
          params: { ids: dto.map((x) => x._id).join(',') },
        }),
      ),
    onSuccess: async () => {
      this.snack.open('عملیات حذف با موفقیت ثبت شد', '', { duration: 3000 });
      client.invalidateQueries({ queryKey: ['devices'] });
    },
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
    private snack: MatSnackBar,
  ) {}

  openFormDialog(device?: Device, isRange?: boolean) {
    this.dialog.open(DeviceFormDialogComponent, { data: { isRange, device } });
  }

  upgrade(device?: Device) {}

  remove(device?: Device) {
    this.dialog
      .open(AlertDialogComponent, {
        data: {
          title: device
            ? `حذف ${device.title}`
            : `حذف ${this.selectedIds().length} دستگاه انتخاب شده`,
          description: device
            ? `در صورت اطمینان از حذف دستگاه انتخاب شده لطفا تایید کنید.`
            : `در صورت اطمینان از حذف دستگاه‌های انتخاب شده لطفا تایید کنید.`,
        },
      })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) {
          this.removeMutation.mutate(
            device ? [device] : this.selectedDevices() || [],
          );
        }
      });
  }
}
