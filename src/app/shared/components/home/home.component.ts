import { Component, AfterViewInit } from '@angular/core';

declare const HSCollapse: any;

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // Initialize Preline UI components
    if (typeof HSCollapse !== 'undefined') {
      HSCollapse.autoInit();
    }
  }
}
