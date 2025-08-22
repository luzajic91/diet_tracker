import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-weight-history-add',
  templateUrl: './user-weight-history-add.component.html',
  styleUrls: ['./user-weight-history-add.component.css']
})
export class UserWeightHistoryAddComponent {
  weightKg: number = 0;
  measuredAt: string = '';
  notes: string = '';
  message: string = '';

  @Output() weightHistoryAdded = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  submitWeightHistory() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.message = 'User not logged in.';
      return;
    }
    const payload = {
      userId: +userId,
      weightKg: this.weightKg,
      measuredAt: this.measuredAt,
      notes: this.notes
    };
    this.http.post('http://localhost:5122/api/UserWeightHistories', payload, { headers: this.getHeaders(), responseType: 'text' }).subscribe({
      next: () => {
        this.message = 'Weight history added!';
        this.weightKg = 0;
        this.measuredAt = '';
        this.notes = '';
        this.weightHistoryAdded.emit();
      },
      error: () => {
        this.message = 'Failed to add weight history.';
      }
    });
  }
}
