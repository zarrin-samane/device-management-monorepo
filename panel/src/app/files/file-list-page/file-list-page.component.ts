import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { SHARED } from '../../shared';
import {
  injectMutation,
  injectQuery,
  QueryClient,
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
import { FileFormDialogComponent } from '../file-form-dialog/file-form-dialog.component';

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
  private queryClient = inject(QueryClient);

  query = injectQuery(() => ({
    queryKey: ['files'],
    queryFn: () => lastValueFrom(this.http.get<File[]>(`/files`)),
  }));

  uploadMutation = injectMutation(() => ({
    mutationFn: (dto: { file: any; title: string; version: number }) =>
      this.filesService.upload(dto.file, dto.title, dto.version),
    onSuccess: async () => {
      this.snack.open('فایل با موفقیت ایجاد شد', '', { duration: 3000 });
      this.queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  }));

  removeMutation = injectMutation(() => ({
    mutationFn: (fileId: string) =>
      lastValueFrom(this.http.delete(`/files/${fileId}`)),
    onSuccess: async () => {
      this.snack.open('فایل حذف شد', '', { duration: 3000 });
      this.queryClient.invalidateQueries({ queryKey: ['files'] });
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
      .open(FileFormDialogComponent)
      .afterClosed()
      .subscribe((dto: { title: string; version: number }) => {
        if (dto) {
          if (this.query.data()?.find((x) => x.version === dto.version)) {
            this.snack.open('ورژن وارد شده تکراری است', '', { duration: 3000 });
          } else {
            this.uploadMutation.mutate({
              title: dto.title,
              version: dto.version,
              file,
            });
          }
        }
      });
  }
}
