import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService) { }

  menu$: Observable<any[]>;

  ngOnInit(): void {
    this.menu$ = this.authService.getMenu();
  }

  logout(){
    this.authService.logout();
  }

}
