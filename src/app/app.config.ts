import { ApplicationConfig, importProvidersFrom, NgModule } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

NgModule({
  imports: [HttpClientModule, FormsModule]
})

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient( withFetch()), importProvidersFrom(WebcamModule)]
};
