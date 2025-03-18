import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  provideAngularQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { apiInterceptorProvider } from './core/api.provider';
import { paginatorIntlProvider } from './core/mat-paginator-intl.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    apiInterceptorProvider(),
    provideAngularQuery(new QueryClient()),
    paginatorIntlProvider(),
  ],
};
