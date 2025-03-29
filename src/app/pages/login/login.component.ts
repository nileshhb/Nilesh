import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ CommonModule, ReactiveFormsModule ]
})
export class LoginComponent {
  isFormVisible = true;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: '',
      password: ''
    });
  }

  login() {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(this.loginForm.value);
  
    this.http.post('http://localhost:3000/api/auth/login', body, { headers })
      .subscribe(
        (response: any) => {
          console.log('Login Success:', response);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        }, 
        error => {
          console.error('Login failed:', error);
        }
      );
  }

  onSubmit() {
    console.log("Form Data:", this.loginForm.value); //Checking values
  }
}
