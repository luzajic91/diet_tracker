import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-weight-history',
  templateUrl: './user-weight-history.component.html',
  styleUrls: ['./user-weight-history.component.css']
})
export class UserWeightHistoryComponent implements OnInit {
  weightHistory: any[] = [];
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<any[]>('http://localhost:5122/api/UserWeightHistories', { headers }).subscribe({
      next: (data) => {
        this.weightHistory = data;
      },
      error: (err) => {
        this.error = 'Failed to fetch weight history.';
      }
    });
  }
}
