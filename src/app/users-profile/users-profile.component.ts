// File deleted
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.css']
})
export class UsersProfileComponent {
  userId: number = 0;
  usersProfileId: number = 0;
  firstName: string = '';
  lastName: string = '';
  createdAt: string = '';
  birthDate: string = '';
  birthDay: string = '';
  heightCm: number = 0;
  message: string = '';

  constructor(private http: HttpClient) {}

  postProfile() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const userId = localStorage.getItem('userId');
    const payload = {
      userId: userId ? +userId : this.userId,
      birthDate: this.birthDate,
      birthDay: this.birthDay,
      heightCm: this.heightCm
    };
    this.http.post('http://localhost:5122/api/UsersProfile', payload, { headers }).subscribe({
      next: () => {
        this.message = 'Profile created successfully!';
      },
      error: () => {
        this.message = 'Failed to create profile.';
      }
    });
  }

  putProfile() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const payload = {
      userId: userId ? +userId : 0,
      email: email || '',
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      birthDate: this.birthDate,
      heightsCm: this.heightCm
    };
    this.http.put(`http://localhost:5122/api/Users/${userId}`, payload, { headers }).subscribe({
      next: () => {
        this.message = 'Profile updated successfully!';
      },
      error: () => {
        this.message = 'Failed to update profile.';
      }
    });
  }
}
