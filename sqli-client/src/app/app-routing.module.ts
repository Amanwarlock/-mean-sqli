import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './features/dashboard.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './auth/login.guard';


const routes: Routes = [
  {path: "", redirectTo: "/dashboard", pathMatch: "full"},
  {path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard], children: [
    {path: "home", component: AuthComponent}
  ]},
  {path: "login", component: AuthComponent, canActivate:[LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
