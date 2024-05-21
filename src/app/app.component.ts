import { Component, HostListener } from '@angular/core';
import { WOW } from 'wowjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  ngOnInit() {
    new WOW().init();
  }
  
  title = 'Food-Corner';
  showScrollButton: boolean = false;


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 100;
  }
    scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
