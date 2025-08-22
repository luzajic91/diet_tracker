import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserWeightHistoryComponent } from './user-weight-history/user-weight-history.component';
import { FoodItemsComponent } from './food-items/food-items.component';
import { MealLogsPostPutComponent } from './meal-logs-post-put/meal-logs-post-put.component';
import { MealLogsGetComponent } from './meal-logs-get/meal-logs-get.component';
import { FoodItemsAddComponent } from './food-items-add/food-items-add.component';
import { MealLogsListComponent } from './meal-logs-list/meal-logs-list.component';

import { UserWeightHistoryAddComponent } from './user-weight-history-add/user-weight-history-add.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { UserWeightHistoryChartComponent } from './user-weight-history-chart/user-weight-history-chart.component';
import { MealLogsSummaryComponent } from './meal-logs-summary/meal-logs-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  RegisterComponent,
  DashboardComponent,
  UserWeightHistoryComponent,
  FoodItemsComponent,
  MealLogsPostPutComponent,
  MealLogsGetComponent,
  FoodItemsAddComponent,
  MealLogsListComponent,
  UserStatisticsComponent,
  UserWeightHistoryAddComponent,
  UserWeightHistoryChartComponent,
  MealLogsSummaryComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
