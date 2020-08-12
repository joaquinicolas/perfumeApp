import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn: Observable<boolean>;
  redirectUrl: string;

  constructor() {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    this.isLoggedIn = this.isLoggedInSubject.asObservable();
  }


  get isLoggedInValue(): boolean {
    return this.isLoggedInSubject.value;
  }

  login(usr: string, passwd: string) {
    if (usr === 'marcos' && passwd === '20m4Rc0S20') {
      this.isLoggedInSubject.next(true);
      return;
    }
    this.isLoggedInSubject.next(false);
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
  }
}
