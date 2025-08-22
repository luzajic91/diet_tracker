import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  createdAt: string = '';
  birthDate: string = '';
  heightsCm: number = 0;
  message: string = '';

  @Output() statisticsSubmitted = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any>(`http://localhost:5122/api/Users/${userId}`, { headers: this.getHeaders() }).subscribe({
        next: (user) => {
          this.email = user.email;
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.createdAt = user.createdAt;
          this.birthDate = user.birthDate;
          this.heightsCm = user.heightsCm;
        }
      });
    }
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  submitStatistics() {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    if (!userId) {
      this.message = 'User not logged in.';
      return;
    }
    const payload = {
      userId: +userId,
      email: email || this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      birthDate: this.birthDate,
      heightsCm: this.heightsCm
    };
    this.http.put(`http://localhost:5122/api/Users/${userId}`, payload, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.message = 'Statistics updated!';
        this.statisticsSubmitted.emit();
      },
      error: () => {
        this.message = 'Failed to update statistics.';
      }
    });
  }
}
