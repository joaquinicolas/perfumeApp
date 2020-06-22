import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string;

  constructor() {
  }

  login(): Observable<boolean> {
    return of(true).pipe(
      tap(val => this.isLoggedIn = true),
      delay(1000)
    );
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
