import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

import { MaterialModule } from '../shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

//Personalización de paginator en todos los módulos a español
import { CustomPaginatorIntl } from './utils/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './guards/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';

import { FuncionariosComponent } from './components/pages/funcionarios/funcionarios.component';
import { MessageDialogComponent } from '../shared/components/message-dialog/message-dialog.component';
import { DialogFuncionarioComponent } from './components/pages/funcionarios/dialog-funcionario/dialog-funcionario.component';

// Define los formatos de fecha
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YY',
  },
  display: {
    dateInput: 'DD/MM/YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FuncionariosComponent,
    MessageDialogComponent,
    DialogFuncionarioComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    provideClientHydration(),
    provideAnimationsAsync(),
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
