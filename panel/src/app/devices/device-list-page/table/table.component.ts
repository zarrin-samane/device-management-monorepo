import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  output,
  Output,
  Signal,
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { ConnectionStatus } from '../../../shared/functions/get-device-status';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

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
    MatTooltipModule,
    MatMenuModule,
    MatListModule,
    MatPaginatorModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  readonly dialog = inject(MatDialog);
  ConnectionStatus = ConnectionStatus;
  checkboxes = viewChildren(MatCheckbox);
  @Output() editClick = new EventEmitter<Device>();
  @Output() upgradeClick = new EventEmitter<Device>();
  @Output() removeClick = new EventEmitter<Device>();
  currentPage = input<number | undefined>(undefined);
  currentPageSize = input<number | undefined>(undefined);
  total = input<number | undefined>(undefined);
  onPageChange = output<number>();
  onPageSizeChange = output<number>();

  displayedColumns: string[] = [
    'checkbox',
    'title',
    'serial',
    'version',
    'tags',
    'connectionAtStatus',
    'actions',
  ];
  @Input() dataSource: Signal<Device[] | undefined>;
  @Input() selectedIds: WritableSignal<string[]>;

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

  pageChange(ev: PageEvent) {
    const { previousPageIndex, pageIndex, pageSize } = ev;
    if (previousPageIndex !== pageIndex) {
      this.onPageChange.emit(pageIndex + 1);
    } else if (pageSize) {
      this.onPageSizeChange.emit(pageSize);
    }
  }
}
