import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { SHARED } from '../../shared';
import {
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { File } from '@device-management/types';
import { MatIconModule } from '@angular/material/icon';
import { FilesService } from '../files.service';
import { MatDialog } from '@angular/material/dialog';
import { PromptDialogComponent } from '../../shared/components/prompt-dialog/prompt-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-file-list-page',
  standalone: true,
  imports: [
    CommonModule,
    SHARED,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './file-list-page.component.html',
  styleUrl: './file-list-page.component.scss',
})
export class FileListPageComponent {
  query = injectQuery(() => ({
    queryKey: ['files'],
    queryFn: () => lastValueFrom(this.http.get<File[]>(`/files`)),
  }));

  uploadMutation = injectMutation((client) => ({
    mutationFn: (dto: { file: any; name: string }) =>
      this.filesService.upload(dto.file, dto.name),
    onSuccess: async () => {
      this.snack.open('فایل با موفقیت ایجاد شد', '', { duration: 3000 });
      client.invalidateQueries({ queryKey: ['files'] });
    },
  }));

  removeMutation = injectMutation((client) => ({
    mutationFn: (fileId: string) =>
      lastValueFrom(this.http.delete(`/files/${fileId}`)),
    onSuccess: async () => {
      this.snack.open('فایل حذف شد', '', { duration: 3000 });
      client.invalidateQueries({ queryKey: ['files'] });
    },
  }));

  constructor(
    private http: HttpClient,
    private filesService: FilesService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) {}

  remove(file: File) {
    this.dialog
      .open(AlertDialogComponent, {
        data: {
          title: `حذف ${file.title}`,
          description: 'در صورت اطمینان از حذف فایل لطفا تایید کنید',
        },
      })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) this.removeMutation.mutate(file._id);
      });
  }

  upload(event: any) {
    const file = event.target.files[0];
    this.dialog
      .open(PromptDialogComponent, {
        data: {
          title: 'آپلود فایل',
          label: 'عنوان فایل',
        },
      })
      .afterClosed()
      .subscribe((name) => {
        if (name) {
          this.uploadMutation.mutate({ name, file });
        }
      });
  }
}
