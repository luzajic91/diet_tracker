import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  birthDate: string = '';
  heightsCm: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const payload = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      heightsCm: this.heightsCm
    };
    this.http.post<any>('http://localhost:5122/api/Auth/register', payload).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('Registration failed. Please try again.');
      }
    });
  }
}
