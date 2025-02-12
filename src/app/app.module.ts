// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Import your components and services
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductService } from './product.service';

@NgModule({
  declarations: [
    AppComponent,  // Declare the root component
    HomeComponent  // Declare any other components (e.g., HomeComponent)
  ],
  imports: [
    BrowserModule,
    HttpClientModule  // This provides HttpClient throughout your app
  ],
  providers: [
    ProductService
  ],
  bootstrap: [AppComponent]  // Bootstraps the root component
})
export class AppModule { }
