import { AfterViewInit, Component, OnInit } from '@angular/core';

// ...existing code...
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-weight-history-chart',
  templateUrl: './user-weight-history-chart.component.html',
  styleUrls: ['./user-weight-history-chart.component.css']
})
export class UserWeightHistoryChartComponent implements OnInit, AfterViewInit {
  weightHistories: any[] = [];
  chartData: any[] = [];
  chartLabels: string[] = [];
  message: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchWeightHistories();
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderChart(), 0);
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  fetchWeightHistories() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.message = 'User not logged in.';
      return;
    }
    this.http.get<any>(`http://localhost:5122/api/UsersProfile/by-user/${userId}`, { headers: this.getHeaders() }).subscribe({
      next: (profile) => {
        const usersProfileId = profile?.usersProfileId;
        if (!usersProfileId) {
          this.message = 'User profile not found.';
          return;
        }
        this.http.get<any[]>(
          'http://localhost:5122/api/UserWeightHistories',
          { headers: this.getHeaders() }
        ).subscribe({
          next: (data) => {
            this.weightHistories = data.filter(h => h.usersProfileId == usersProfileId);
            this.chartLabels = this.weightHistories.map(h => h.measuredAt.split('T')[0]);
            this.chartData = this.weightHistories.map(h => h.weightKg);
            this.renderChart();
          },
          error: () => {
            this.message = 'Failed to fetch weight histories.';
          }
        });
      },
      error: () => {
        this.message = 'Failed to fetch user profile.';
      }
    });
  }

  renderChart() {
  if (!window.Chart || !this.chartData.length) return;
  const ctx = (document.getElementById('weightChart') as HTMLCanvasElement)?.getContext('2d');
  if (!ctx) return;
  new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Weight (kg)',
          data: this.chartData,
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          fill: true,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: false }
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Weight (kg)' } }
        }
      }
    });
  }
}
