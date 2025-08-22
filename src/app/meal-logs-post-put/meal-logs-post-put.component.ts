import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-meal-logs-post-put',
  templateUrl: './meal-logs-post-put.component.html',
  styleUrls: ['./meal-logs-post-put.component.css']
})
export class MealLogsPostPutComponent {
  @Input() mode: 'add' | 'edit' = 'add';
  @Output() mealLogChange = new EventEmitter<any>();
  newMealLog: any = {};
  updateMealLog: any = {};
  message: string = '';
  foodItems: any[] = [];

  constructor(private http: HttpClient) {
    if (this.mode === 'add') {
      this.fetchFoodItems();
    }
  }

  ngOnInit() {
    if (this.mode === 'add') {
      this.fetchFoodItems();
    }
  }

  fetchFoodItems() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<any[]>('http://localhost:5122/api/FoodItems', { headers }).subscribe({
      next: (data) => {
        this.foodItems = data;
      },
      error: () => {
        this.foodItems = [];
      }
    });
  }

  // For add mode, emit changes to parent
  onFormChange() {
    if (this.mode === 'add') {
      // Remove recipeId if present
      if ('recipeId' in this.newMealLog) {
        delete this.newMealLog.recipeId;
      }
      this.mealLogChange.emit(this.newMealLog);
    }
  }

  updateMealLogById() {
    if (!this.updateMealLog.logId) return;
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.updateMealLog.userId = +userId;
    }
    // Remove recipeId if present
    if ('recipeId' in this.updateMealLog) {
      delete this.updateMealLog.recipeId;
    }
    this.http.put(`http://localhost:5122/api/MealLogs/${this.updateMealLog.logId}`, this.updateMealLog, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.message = 'Meal log updated!';
        this.updateMealLog = {};
      },
      error: () => {
        this.message = 'Failed to update meal log.';
      }
    });
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }
}
