/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Hammer from 'hammerjs';
import {
  bootstrapApplication,
  HammerGestureConfig,
  HammerModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppModule } from './app/app.module';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { MyHammerConfig } from './app/employees/employees.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
