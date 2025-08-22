import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface FoodItem {
  foodId: number;
  foodItemsName: string;
  calories: number;
  carbsG: number;
  fatG: number;
  proteinG: number;
  isCustom: boolean;
}

@Component({
  selector: 'app-food-items',
  templateUrl: './food-items.component.html',
  styleUrls: ['./food-items.component.css']
})
export class FoodItemsComponent {
  foodItems: FoodItem[] = [];
  selectedFoodItem: FoodItem | null = null;
  foodIdToFetch: number | null = null;
  error: string = '';

  constructor(private http: HttpClient) {}

  getAllFoodItems() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<FoodItem[]>('http://localhost:5122/api/FoodItems', { headers }).subscribe({
      next: (data) => {
        this.foodItems = data;
        this.error = '';
      },
      error: () => {
        this.error = 'Failed to fetch food items.';
      }
    });
  }

  getFoodItemById() {
    if (this.foodIdToFetch == null) return;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<FoodItem>(`http://localhost:5122/api/FoodItems/${this.foodIdToFetch}`, { headers }).subscribe({
      next: (data) => {
        this.selectedFoodItem = data;
        this.error = '';
      },
      error: () => {
        this.error = 'Failed to fetch food item.';
      }
    });
  }
}
