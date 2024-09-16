import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SHARED } from '../../shared';

@Component({
  selector: 'app-file-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SHARED,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './file-form-dialog.component.html',
  styleUrl: './file-form-dialog.component.scss',
})
export class FileFormDialogComponent {
  readonly data = inject<{
    title: string;
    version: number;
  }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<FileFormDialogComponent>);
  readonly title = this.data?.title;
  readonly version = this.data?.version;
  formGroup: FormGroup;

  constructor() {
    this.formGroup = new FormGroup({
      title: new FormControl(this.title, Validators.required),
      version: new FormControl(
        this.version ? Number(this.version) : '',
        Validators.required,
      ),
    });
  }

  submit() {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.getRawValue());
    }
  }
}
