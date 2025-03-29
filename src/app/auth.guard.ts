import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const hasImage = localStorage.getItem('hasImage'); // Store this after image upload

    if (token) {
      if (!hasImage || hasImage === 'false') {
        this.router.navigate(['/image-capture']); // Redirect if no profile image
        return false;
      }
      return true; // Allow access if token exists & image uploaded
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
