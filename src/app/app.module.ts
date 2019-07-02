import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatTableModule } from '@angular/material';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertComponent } from './alert/alert.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';
import { DecksComponent } from './decks/decks.component';
import { GoogleLineChartService } from './google-charts/google-line-chart-service';
import { LineChartComponent } from './google-charts/line-chart.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';
import { RegistrationComponent } from './registration/registration.component';
import { TokenInterceptor } from './_helper/token.interceptor';
 
@NgModule({
  declarations: [
    AppComponent,
    DecksComponent,
    DeckDetailComponent,
    MessagesComponent,
    DashboardComponent,
    LineChartComponent,
    LoginComponent,
    RegistrationComponent,
    AlertComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule
  ],
  providers: [
    GoogleLineChartService,
    // Token Interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
