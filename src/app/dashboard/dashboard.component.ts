import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
  activeModal: string | null = null;
  addMealLogModals: number[] = [];
  mealLogsData: any[] = [];
  hasUserProfile: boolean = false;
  showWeightHistoryModal = false;

  constructor(private http: HttpClient, private router: Router) {
    this.checkUserProfile();
  }

  checkUserProfile() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.hasUserProfile = false;
      return;
    }
    this.http.get<any>(`http://localhost:5122/api/UsersProfile/by-user/${userId}`, { headers: this.getHeaders() }).subscribe({
      next: (profile) => {
        this.hasUserProfile = !!profile && !!profile.usersProfileId;
      },
      error: () => {
        this.hasUserProfile = false;
      }
    });
  }

  showModal(modal: string) {
    this.activeModal = modal;
    if (modal === 'addMealLog' && this.addMealLogModals.length === 0) {
      this.addMealLogModals = [0];
      this.mealLogsData = [{}];
    }
  }

  closeModal() {
    this.activeModal = null;
    this.addMealLogModals = [];
    this.mealLogsData = [];
  }

  addAnotherMealLogModal() {
    this.addMealLogModals.push(this.addMealLogModals.length);
    this.mealLogsData.push({});
  }

  removeMealLogModal(index: number) {
    this.addMealLogModals.splice(index, 1);
    this.mealLogsData.splice(index, 1);
  }

  onMealLogChange(data: any, index: number) {
    this.mealLogsData[index] = data;
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  createAllMealLogs() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    const logsToCreate = this.mealLogsData.map(log => ({ ...log, userId: +userId }));
    logsToCreate.forEach((log, idx) => {
      console.log('Posting meal log payload:', log);
      this.http.post('http://localhost:5122/api/MealLogs', log, { headers: this.getHeaders() }).subscribe({
        next: () => {
          // Optionally show a message or reset form
          this.mealLogsData[idx] = {};
        },
        error: () => {
          // Optionally show error
        }
      });
    });
  // Close modal after creation
  this.closeModal();
  }
  
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
