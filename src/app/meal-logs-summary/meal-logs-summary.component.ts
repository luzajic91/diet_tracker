import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-meal-logs-summary',
  templateUrl: './meal-logs-summary.component.html',
  styleUrls: ['./meal-logs-summary.component.css']
})
export class MealLogsSummaryComponent implements OnInit {
  summaryByDay: any[] = [];
  filteredSummary: any[] = [];
  error: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSummaryByDay();
  }

  getSummaryByDay(): void {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      this.error = 'User not authenticated.';
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<any[]>(`http://localhost:5122/api/MealLogs/summary-by-day?userId=${userId}`, { headers }).subscribe({
      next: (data) => {
        this.summaryByDay = data;
        this.filterAndSort();
        this.error = '';
      },
      error: () => {
        this.error = 'Failed to fetch summary.';
      }
    });
  }

  filterAndSort(): void {
    let filtered = this.summaryByDay;
    if (this.startDate) {
      filtered = filtered.filter(row => new Date(row.date) >= new Date(this.startDate));
    }
    if (this.endDate) {
      filtered = filtered.filter(row => new Date(row.date) <= new Date(this.endDate));
    }
    filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.filteredSummary = filtered;
  }

  onDateChange(): void {
    this.filterAndSort();
  }
}
