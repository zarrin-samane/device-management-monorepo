import { Component, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { SHARED } from '../../../shared';
import { Device } from '@device-management/types';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DeviceFormDialogComponent } from '../../device-form-dialog/device-form-dialog.component';
import { ConnectionStatus } from '../../../shared/pipes/connection-status.pipe';

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
    MatCheckboxModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  readonly dialog = inject(MatDialog);
  ConnectionStatus = ConnectionStatus
  
  displayedColumns: string[] = [
    'checkbox',
    'title',
    'serial',
    'tags',
    'connectionAtStatus',
    'actions',
  ];
  @Input() dataSource: Device[];

  edit(device: Device) {
    this.dialog.open(DeviceFormDialogComponent, {
      data: { device },
    });
  }
}
