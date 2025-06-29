import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgApexchartsModule } from 'ng-apexcharts'; // ✅ Import NgApexchartsModule
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/Jwt.Interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([JwtInterceptor]) 
    ),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    { provide: MessageService, useClass: MessageService },
    importProvidersFrom(NgApexchartsModule)
  ]
};
