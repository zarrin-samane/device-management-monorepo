import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED } from '../../shared';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { File } from '@device-management/types';

@Component({
  selector: 'app-file-list-dialog',
  standalone: true,
  imports: [CommonModule, SHARED, MatDialogModule, MatListModule],
  templateUrl: './file-list-dialog.component.html',
  styleUrl: './file-list-dialog.component.scss',
})
export class FileListDialogComponent {
  query = injectQuery(() => ({
    queryKey: ['files'],
    queryFn: () => lastValueFrom(this.http.get<File[]>(`/files`)),
  }));

  constructor(private http: HttpClient) {}
}
