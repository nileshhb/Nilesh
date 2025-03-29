import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [ ReactiveFormsModule, FormsModule ]
})
export class SignupComponent {
  signupForm: FormGroup;


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signupForm = this.fb.group({
      name: '',
      email: '',
      password: '',
      role: 'worker' // By default role
    });
  }

  signup() {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("You must be logged in as an admin to create a user.");
      return;
    }
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    this.http.post('http://localhost:3000/api/auth/signup', this.signupForm.value, { headers })
      .subscribe(
        response => {
          console.log('Signup successful', response);
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Signup failed', error);
          alert(`Signup failed: ${error.error.message || 'Unknown error'}`);
        }
      );
  }
  
}
