import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DashboardComponent implements OnInit {

  users: any[] = [];
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, public router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token; //Checking User Login

    if (!localStorage.getItem('hasImage')) {
      this.router.navigate(['/image-capture']);
      return; 
    }

    this.http.get('http://localhost:3000/api/users', {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    }).subscribe((data: any) => {
      this.users = data;
    }, error => {
      console.error('Error fetching users', error);
    });
  }

  createUser() {
    this.router.navigate(['/signup']);
  }

  updateUser(user: any) {
    const token = localStorage.getItem('token');

    this.http.put(`http://localhost:3000/api/users/${user._id}`, user, {
      headers: { 
        'Authorization': token ? `Bearer ${token}` : '', 
        'Content-Type': 'application/json' 
      }
    }).subscribe(() => {
      console.log(`User ${user._id} updated successfully`);
      this.ngOnInit(); // Refresh the list
    }, error => {
      console.error('Error updating user', error);
    });
  }

  switchRole(user: any) {
    const roles = ['supervisor', 'worker'];
    const currentIndex = roles.indexOf(user.role);
    user.role = roles[(currentIndex + 1) % roles.length];
    this.updateUser(user);
  }

  deleteUser(id: string) {
    const token = localStorage.getItem('token');
    this.http.delete(`http://localhost:3000/api/users/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    }).subscribe(() => {
      console.log(`User ${id} deleted successfully`);
      this.ngOnInit();
    }, error => {
      console.error('Error deleting user', error);
    });
  }

  getUserProfileImage(userId: string): string {
    return `http://localhost:3000/api/users/${userId}/image`;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('hasImage')
    //console.log(localStorage.getItem('token') );    //Checking Log-out
    console.log("Successfully Logged out");
    alert("Successfully logged out!")
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
