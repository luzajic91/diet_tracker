import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface MealLog {
  logId: number;
  userId: number;
  foodId: number;
  quantityG: number;
  consimedAt: string;
}

interface FoodDetails {
  foodId: number;
  foodItemsName: string;
  servingSize?: number;
}

interface UserDetails {
  userId: number;
  firstname: string;
  lastname: string;
}

@Component({
  selector: 'app-meal-logs-get',
  templateUrl: './meal-logs-get.component.html',
  styleUrls: ['./meal-logs-get.component.css']
})
export class MealLogsGetComponent {
  mealLogs: MealLog[] = [];
  userDetailsMap: { [userId: number]: UserDetails } = {};
  foodDetailsMap: { [foodId: number]: FoodDetails } = {};
  error: string = '';

  constructor(private http: HttpClient) {}

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }
  

  getAllMealLogs() {
    const userId = localStorage.getItem('userId');
    this.http.get<MealLog[]>('http://localhost:5122/api/MealLogs', { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        const filtered = userId ? data.filter(log => log.userId === +userId) : data;
        this.mealLogs = filtered;
        this.error = '';
        // Fetch user details for all unique userIds
        const userIds = Array.from(new Set(filtered.map(log => log.userId)));
        userIds.forEach(uid => this.fetchUserDetails(uid));
        // Fetch food details for all unique foodIds
        const foodIds = Array.from(new Set(filtered.map(log => log.foodId)));
        foodIds.forEach(fid => this.fetchFoodDetails(fid));
      },
      error: () => {
        this.error = 'Failed to fetch meal logs.';
      }
    });
  }

  fetchFoodDetails(foodId: number) {
    if (this.foodDetailsMap[foodId]) return; // Already fetched
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

  getServings(log: MealLog): string {
    const food = this.foodDetailsMap[log.foodId];
    if (food && food.servingSize) {
      return (log.quantityG / food.servingSize).toFixed(2);
    }
    return (log.quantityG / 100).toFixed(2);
  }

  getFoodName(foodId: number): string {
    const food = this.foodDetailsMap[foodId];
    return food ? food.foodItemsName : 'Food ' + foodId;
  }

  fetchUserDetails(userId: number) {
    if (this.userDetailsMap[userId]) return; // Already fetched
    this.http.get<any>(`http://localhost:5122/api/Users/${userId}`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.userDetailsMap[userId] = {
          userId: userId,
          firstname: data.firstname || data.firstName || '',
          lastname: data.lastname || data.lastName || ''
        };
      },
      error: () => {
        this.userDetailsMap[userId] = { userId, firstname: 'Unknown', lastname: 'Also unknown' };
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
}
