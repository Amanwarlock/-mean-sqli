import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': this.getToken()
    })
  };

  isLoggedIn(): Observable<boolean>{
    let token = this.getToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': token
      })
    };
    return this.http.get('/api/v1/isLoggedIn', httpOptions ).pipe(map((res: {isLoggedIn: boolean})=>{
      if(res.isLoggedIn) return true;
      else return false;
    }));
  }

  login(data): Observable<any>{
    return this.http.post<Observable<any>>(`/api/v1/login`, data).pipe(tap(d=>{
      this.storeToken(d[0].token);
    }));
  }

  logout(): Observable<any>{
    this.removeToken();
    return new Observable<any>(observer=> observer.next());
  }

  storeToken(token){
    localStorage.setItem('token', token);
  }

  getToken(){
    let token = localStorage.getItem('token')
    return token ? token: '';
  }

  removeToken(){
    localStorage.removeItem('token');
  }

  getMenu(): Observable<any[]>{
    const url = "assets/menu.json";
    return this.http.get<any[]>(url).pipe(tap(r=>{
    }),catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}
