import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface MealLog {
  logId: number;
  userId: number;
  foodId: number;
  quantityG: number;
  consimedAt: string;
}

interface UserDetails {
  userId: number;
  firstname: string;
  lastname: string;
}

interface FoodDetails {
  foodId: number;
  foodItemsName: string;
  servingSize?: number;
}

@Component({
  selector: 'app-meal-logs-list',
  templateUrl: './meal-logs-list.component.html',
  styleUrls: ['./meal-logs-list.component.css']
})
export class MealLogsListComponent {
  mealLogs: MealLog[] = [];
  filteredMealLogs: MealLog[] = [];
  userDetailsMap: { [userId: number]: UserDetails } = {};
  foodDetailsMap: { [foodId: number]: FoodDetails } = {};
  error: string = '';
  sortText: string = '';

  constructor(private http: HttpClient) {
    this.getAllMealLogs();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAllMealLogs() {
    this.http.get<MealLog[]>('http://localhost:5122/api/MealLogs', { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.mealLogs = data;
        this.filteredMealLogs = data;
        this.error = '';
        // Fetch user and food details
        const userIds = Array.from(new Set(data.map(log => log.userId)));
        userIds.forEach(userId => this.fetchUserDetails(userId));
        const foodIds = Array.from(new Set(data.map(log => log.foodId)));
        foodIds.forEach(foodId => this.fetchFoodDetails(foodId));
      },
      error: () => {
        this.error = 'Failed to fetch meal logs.';
      }
    });
  }

  fetchUserDetails(userId: number) {
    if (this.userDetailsMap[userId]) return;
    this.http.get<any>(`http://localhost:5122/api/Users/${userId}`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.userDetailsMap[userId] = {
          userId: userId,
          firstname: data.firstname || data.firstName || '',
          lastname: data.lastname || data.lastName || ''
        };
      },
      error: () => {
        this.userDetailsMap[userId] = { userId, firstname: 'Unknown', lastname: '' };
      }
    });
  }

  fetchFoodDetails(foodId: number) {
    if (this.foodDetailsMap[foodId]) return;
    this.http.get<any>(`http://localhost:5122/api/FoodItems/${foodId}`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.foodDetailsMap[foodId] = {
          foodId: foodId,
          foodItemsName: data.foodItemsName || data.name || 'Unknown',
          servingSize: data.servingSize || 100
        };
      },
      error: () => {
        this.foodDetailsMap[foodId] = { foodId, foodItemsName: 'Unknown', servingSize: 100 };
      }
    });
  }

  getUserName(userId: number): string {
    const user = this.userDetailsMap[userId];
    if (user) {
      return user.firstname + ' ' + user.lastname;
    }
    return 'User ' + userId;
  }

  getFoodName(foodId: number): string {
    const food = this.foodDetailsMap[foodId];
    return food ? food.foodItemsName : 'Food ' + foodId;
  }

  getServings(log: MealLog): string {
    const food = this.foodDetailsMap[log.foodId];
    if (food && food.servingSize) {
      return (log.quantityG / food.servingSize).toFixed(2);
    }
    return (log.quantityG / 100).toFixed(2);
  }

  onSortTextChange() {
    const text = this.sortText.toLowerCase();
    this.filteredMealLogs = this.mealLogs.filter(log => {
      const user = this.getUserName(log.userId).toLowerCase();
      const food = this.getFoodName(log.foodId).toLowerCase();
      return user.includes(text) || food.includes(text);
    });
  }
}
