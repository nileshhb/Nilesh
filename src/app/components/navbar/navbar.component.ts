import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  home() {
    this.router.navigate(['/']);
    }

  isHomePage(): boolean {
    return this.router.url === '/';
   }

}
