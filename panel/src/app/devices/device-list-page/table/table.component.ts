import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  Signal,
  signal,
  viewChildren,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { SHARED } from '../../../shared';
import { Device } from '@device-management/types';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
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
  ConnectionStatus = ConnectionStatus;
  checkboxes = viewChildren(MatCheckbox);
  @Output() onEdit = new EventEmitter<Device>();
  @Output() onUpgrade = new EventEmitter<Device>();
  @Output() onRemove = new EventEmitter<Device>();

  displayedColumns: string[] = [
    'checkbox',
    'title',
    'serial',
    'tags',
    'connectionAtStatus',
    'actions',
  ];
  @Input() dataSource: Signal<Device[] | undefined>;
  @Input() selectedIds: WritableSignal<string[]>;

  constructor() {}

  clearSelection() {
    this.selectedIds.set([]);
    this.checkboxes().forEach((checkbox) => (checkbox.checked = false));
  }

  toggle(item: Device) {
    const selection = this.selectedIds();
    const index = selection.indexOf(item._id);
    if (index > -1) selection.splice(index, 1);
    else selection.push(item._id);
    this.selectedIds.set([...selection]);
  }

  toggleAll() {
    if (this.selectedIds().length === this.dataSource()?.length) {
      this.selectedIds.set([]);
      this.clearSelection();
    } else {
      this.selectedIds.set(this.dataSource()?.map((x) => x._id) || []);
      this.checkboxes().forEach((x) => (x.checked = true));
    }
  }
}
