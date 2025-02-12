// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // <-- Import HttpClientModule

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';  // We'll create this next

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule  // <-- Add here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
