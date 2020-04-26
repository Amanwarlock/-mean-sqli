import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  menu$: Observable<any[]>;

  ngOnInit(): void {
    this.menu$ = this.authService.getMenu();
  }

  logout(){
    this.authService.logout().subscribe(d=>{
      this.router.navigate(["/login"]);
    });
  }

}
