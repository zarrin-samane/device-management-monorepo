import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED } from '../../shared';
import { AuthService } from '../auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    SHARED,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading = signal(false);
  private snack = inject(MatSnackBar);

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async login(username: string, password: string, ev: SubmitEvent) {
    this.loading.set(true);
    try {
      await this.auth.login(username, password);
      this.router.navigate(['/'], {});
      ev.preventDefault();
    } catch (error) {
      this.snack.open('نام کاربری یا رمز عبور اشتباه است', '', {
        duration: 3000,
      });
      this.loading.set(false);
    }
  }
}
