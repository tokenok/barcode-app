import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',   // Use this tag to include the component elsewhere.
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('HomeComponent initialized');
  }

}
