// src/app/app.component.ts
import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,  // if you're using standalone components
  imports: [HomeComponent],  // <-- Import HomeComponent here
  template: `<app-home></app-home>`,  // You can directly use the tag here
  // styleUrls: ['./app.component.css']  // if you have styles
})
export class AppComponent {}
