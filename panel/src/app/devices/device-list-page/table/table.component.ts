import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { SHARED } from '../../../shared';
import { Device } from '@device-management/types';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeviceFormDialogComponent } from '../../device-form-dialog/device-form-dialog.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    SHARED,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['title', 'serial', 'tags', 'actions'];
  @Input() dataSource: Device[];

  edit(device: Device) {
    this.dialog.open(DeviceFormDialogComponent, {
      data: { device },
    });
  }
}
