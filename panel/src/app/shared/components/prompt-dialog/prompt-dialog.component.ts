import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-prompt-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './prompt-dialog.component.html',
  styleUrl: './prompt-dialog.component.scss',
})
export class PromptDialogComponent {
  readonly data = inject<{
    title: string;
    label: string;
    description?: string;
  }>(MAT_DIALOG_DATA);
  readonly title = this.data.title;
  readonly description = this.data.description;
  readonly label = this.data.label;
}
