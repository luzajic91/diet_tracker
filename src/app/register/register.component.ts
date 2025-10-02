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
    console.log('Register button clicked');
    const payload = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      heightsCm: this.heightsCm
    };
    console.log('Registering user with payload:', payload);
    this.http.post<any>('http://localhost:5122/api/Auth/register', payload).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        let errorMsg = 'Registration failed. Please try again.';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg += '\nDetails: ' + err.error;
          } else if (err.error.message) {
            errorMsg += '\nDetails: ' + err.error.message;
          } else {
            errorMsg += '\nDetails: ' + JSON.stringify(err.error);
          }
        }
        alert(errorMsg);
        console.error('Registration error:', err);
      }
    });
  }
}
