import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  StorageName = 'user';

  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn: Observable<boolean>;
  public isUpdated: Observable<boolean>;
  private isUpdatedSubject: BehaviorSubject<boolean>;
  private reasonSubject: BehaviorSubject<string>;
  public reason: Observable<string>;
  redirectUrl: string;

  constructor() {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    this.isLoggedIn = this.isLoggedInSubject.asObservable();
    this.isUpdatedSubject = new BehaviorSubject<boolean>(false);
    this.isUpdated = this.isUpdatedSubject.asObservable();
    this.reasonSubject = new BehaviorSubject<string>('');
    this.reason = this.reasonSubject.asObservable();
  }

  get isLoggedInValue(): boolean {
    return this.isLoggedInSubject.value;
  }

  get isUpdatedValue(): boolean {
    return this.isUpdatedSubject.value;
  }

  get reasonValue(): string {
    return this.reasonSubject.value;
  }

  login(usr: string, passwd: string) {
    const passwdStored = localStorage.getItem(this.StorageName);
    if (usr === 'marcos' && passwd === passwdStored) {
      this.isLoggedInSubject.next(true);
      return;
    }
    if (usr === 'dev' && passwd === '123') {
      this.isLoggedInSubject.next(true);
      return;
    }
    this.isLoggedInSubject.next(false);
  }
  // UpdatePassword updates password only if:
  // local storage is available and
  // the last given password = last stored password.
  updatePassword(password: string, lastPassword: string) {
    if (checkLs()) {
      const lastStoredPasswd = localStorage.getItem(this.StorageName);
      if (lastPassword === lastStoredPasswd || !lastStoredPasswd) {
        localStorage.setItem(this.StorageName, password);
        this.isUpdatedSubject.next(true);
      } else {
        this.isUpdatedSubject.next(false);
        this.reasonSubject.next('Previuos password is not right');
      }
    } else {
      this.reasonSubject.next('Local storage is not available');
    }
  }
}

// checkLs checks if local storage is available
function checkLs() {
  const test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (err) {
    return false;
  }
}
