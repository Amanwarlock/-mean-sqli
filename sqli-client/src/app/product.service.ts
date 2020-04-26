import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': this.authService.getToken()
    })
  };


  list(): Observable<any[]> {
    return this.http.get<any[]>('/api/v1/products', this.httpOptions);
  }

}
