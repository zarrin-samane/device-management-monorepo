import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SHARED } from '../../shared';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Device } from '@device-management/types';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-device-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SHARED,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './device-form-dialog.component.html',
  styleUrl: './device-form-dialog.component.scss',
})
export class DeviceFormDialogComponent {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly dialogRef = inject(MatDialogRef<DeviceFormDialogComponent>);
  readonly data? = inject<{ device?: Device; isRange?: boolean }>(
    MAT_DIALOG_DATA
  );
  readonly device = this.data?.device;
  formGroup: FormGroup;
  mutation = injectMutation((client) => ({
    mutationFn: (dto: Device | Device[]) =>
      lastValueFrom(this.http.post('/devices', dto)),
    onSuccess: async () => {
      this.snack.open('با موفقیت ثبت شد', '', { duration: 3000 });
      this.dialogRef.close();
      client.invalidateQueries({ queryKey: ['devices'] });
    },
  }));

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snack: MatSnackBar
  ) {
    this.formGroup = this.fb.group({
      title: [this.device?.title, Validators.required],
      serial: [this.device?.serial, Validators.required],
      toSerial: [],
      tags: [
        this.device?.tags ? [...this.device.tags] : [],
        Validators.required,
      ],
    });
  }

  get tags() {
    return this.formGroup.get('tags')?.value || [];
  }

  get serialsArray() {
    try {
      const from = Number(
        this.formGroup.get('serial')?.value?.replace(/-/g, '')
      );
      const to = Number(
        this.formGroup.get('toSerial')?.value?.replace(/-/g, '')
      );
      const serials = [];
      for (let serialNumber = from; serialNumber <= to; serialNumber++) {
        serials.push(
          serialNumber.toString().slice(0, 2) +
            '-' +
            serialNumber.toString().slice(2, 4) +
            '-' +
            serialNumber.toString().slice(4)
        );
      }
      return serials;
    } catch (error) {
      return [];
    }
  }

  get dto() {
    if (this.data?.isRange) {
      const fv = this.formGroup.value;
      const dtos: Device[] = this.serialsArray.map(
        (x) =>
          ({
            serial: x,
            tags: fv.tags,
            title: fv.title,
          } as Device)
      );
      return dtos;
    } else {
      const dto: Device = this.formGroup.value;
      if (this.device) dto._id = this.device._id;
      return dto;
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.formGroup.get('tags')?.setValue([...this.tags, value]);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const tags: string[] = this.tags;
    tags.splice(tags.indexOf(tag), 1);
    this.formGroup.get('tags')?.setValue(tags);
  }
}
