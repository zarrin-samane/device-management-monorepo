import { Component, computed, signal, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { HttpClient } from '@angular/common/http';
import { debounceTime, lastValueFrom } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SHARED } from '../../shared';
import { DeviceFormDialogComponent } from '../device-form-dialog/device-form-dialog.component';
import { TableComponent } from './table/table.component';
import { Device, DeviceFilterDto } from '@device-management/types';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileListDialogComponent } from '../../files/file-list-dialog/file-list-dialog.component';
import { ConnectionStatusText } from '../../shared/pipes/connection-status.pipe';
import {
  ConnectionStatus,
  getDeviceStatus,
} from '../../shared/functions/get-device-status';
import { CsvService } from '../services/csv.service';

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
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './device-list-page.component.html',
  styleUrl: './device-list-page.component.scss',
})
export class DeviceListPageComponent {
  ConnectionStatus = ConnectionStatus;
  ConnectionStatusText = ConnectionStatusText;
  searchControl = new FormControl('');
  @ViewChild(TableComponent) table: TableComponent;
  private queryClient = inject(QueryClient);
  searchText = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300)),
    {
      initialValue: '',
    },
  );
  selectedTag = signal<string | null>(null);
  selectedStatus = signal<ConnectionStatus | null>(null);
  selectedCurrentVersion = signal<number | null>(null);
  page = signal(1);
  limit = signal(100);

  filter = computed(() => {
    const dto: DeviceFilterDto = {};
    dto.query = this.searchText() || undefined;
    dto.tag = this.selectedTag() || undefined;
    const currentVersion = this.selectedCurrentVersion();
    if (typeof currentVersion === 'number') {
      dto.currentVersion = currentVersion;
    }
    if (this.selectedStatus() != null) {
      const status = Number(this.selectedStatus());
      const min = new Date();
      const max = new Date();
      switch (status) {
        case ConnectionStatus.Null:
          dto.nullConnectionAt = true;
          break;
        case ConnectionStatus.Online:
          min.setHours(min.getHours() - 2);
          dto.minConnectionAt = min;
          break;
        case ConnectionStatus.Pending:
          min.setHours(min.getHours() - 48);
          max.setHours(min.getHours() - 2);
          dto.minConnectionAt = min;
          dto.maxConnectionAt = max;
          break;
        case ConnectionStatus.Offline:
          max.setHours(min.getHours() - 48);
          dto.minConnectionAt = new Date('1990-01-01');
          dto.maxConnectionAt = max;
          break;
      }
    }

    dto.page = this.page();
    dto.limit = this.limit();

    return dto;
  });

  selectedIds = signal<string[]>([]);
  selectedDevices = computed(() => {
    const selectedIds = this.selectedIds();
    return this.data()?.filter((x) => selectedIds.includes(x._id));
  });
  hasSelection = computed(() => {
    return this.selectedIds().length > 0;
  });

  query = injectQuery(() => ({
    queryKey: ['devices', 'filter', this.filter()],
    queryFn: () =>
      lastValueFrom(
        this.http.post<{ data: Device[]; count: number }>(
          `/devices/filter`,
          this.filter(),
        ),
      ),
    refetchInterval: 20000,
  }));

  tagsQuery = injectQuery(() => ({
    queryKey: ['devices', 'tags'],
    queryFn: () => lastValueFrom(this.http.get<string[]>(`/devices/tags`)),
    refetchInterval: 20000,
  }));

  removeMutation = injectMutation(() => ({
    mutationFn: (dto: Device[]) =>
      lastValueFrom(
        this.http.post(
          '/devices/remove',
          dto.map((x) => x._id),
        ),
      ),
    onSuccess: async () => {
      this.snack.open('عملیات حذف با موفقیت ثبت شد', '', { duration: 3000 });
      this.queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  }));

  upgradeMutation = injectMutation(() => ({
    mutationFn: (dto: { ids: string[]; version: number }) =>
      lastValueFrom(
        this.http.get(`/devices/upgrade/${dto.version}`, {
          params: { ids: dto.ids.join(',') },
        }),
      ),
    onSuccess: async () => {
      this.snack.open('بروزرسانی با موفقیت انجام شد', '', { duration: 3000 });
      this.queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  }));

  data = computed(() => {
    return this.query.data()?.data;
  });

  tags = computed(() => {
    // const data = this.query.data();
    // if (data) {
    //   const tags = data.map((x) => x.tags || []).flat();
    //   return [...new Set(tags)];
    // }
    return [];
  });

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private csvService: CsvService,
  ) {}

  openFormDialog(device?: Device, isRange?: boolean) {
    this.dialog.open(DeviceFormDialogComponent, { data: { isRange, device } });
  }

  upgrade(device?: Device) {
    this.dialog
      .open(FileListDialogComponent)
      .afterClosed()
      .subscribe((file) => {
        if (file?.version) {
          this.upgradeMutation.mutate({
            ids: device ? [device._id] : this.selectedIds(),
            version: file.version,
          });
        }
      });
  }

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

  async uploadCsv(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      const devices = await this.csvService.processDeviceCsvFile(file);
      if (devices.length === 0) {
        this.snack.open('هیچ دستگاه معتبری در فایل CSV یافت نشد', '', { duration: 3000 });
        return;
      }

      // Use existing save mutation to create devices
      await lastValueFrom(this.http.post('/devices', devices));
      
      this.snack.open(`${devices.length} دستگاه با موفقیت اضافه شد`, '', { duration: 3000 });
      this.query.refetch();
      
      // Reset file input
      this.fileInput.nativeElement.value = '';
    } catch (error: any) {
      this.snack.open(error?.message || 'خطا در پردازش فایل CSV', '', { duration: 3000 });
    }
  }
}
