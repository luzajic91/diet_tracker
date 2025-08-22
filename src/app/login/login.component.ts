import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const payload = {
      email: this.email,
      password: this.password
    };
    console.log('Login payload:', payload);
    this.http.post<any>('http://localhost:5122/api/Auth/login', payload).subscribe({
      next: (response) => {
        // Save JWT token and userId to localStorage
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          if (response.userId) {
            localStorage.setItem('userId', response.userId.toString());
          }
          this.router.navigate(['/dashboard']);
        } else {
          alert('Login failed: No token received.');
        }
      },

      //console.log('Login successful:', response);
      error: (err) => {
        alert('Login failed. Please check your credentials.');
      }
    });
  }
}
