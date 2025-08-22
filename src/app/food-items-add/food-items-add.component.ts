import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-food-items-add',
  templateUrl: './food-items-add.component.html',
  styleUrls: ['./food-items-add.component.css']
})
export class FoodItemsAddComponent {
  foodItem: any = {
    foodItemsName: '',
    calories: 0,
    carbsG: 0,
    fatG: 0,
    proteinG: 0,
    servingSize: 0,
    servingName: ''
  };
  message: string = '';
  @Output() foodAdded = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  getHeaders() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  addFoodItem() {
    this.http.post('http://localhost:5122/api/FoodItems', this.foodItem, { headers: this.getHeaders(), responseType: 'text' }).subscribe({
      next: () => {
        this.message = 'Food item added!';
        this.foodItem = {
          foodItemsName: '', calories: 0, carbsG: 0, fatG: 0, proteinG: 0, servingSize: 0, servingName: ''
        };
        this.foodAdded.emit();
      },
      error: () => {
        this.message = 'Failed to add food item.';
      }
    });
  }
}
