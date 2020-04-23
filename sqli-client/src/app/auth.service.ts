import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  isLoggedIn(): Observable<boolean>{
    return this.http.get('/api/v1/isLoggedIn').pipe(map((res: {isLoggedIn: boolean})=>{
      if(res.isLoggedIn) return true;
      else return false;
    }));
  }

  login(){

  }

  logout(){
    
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
