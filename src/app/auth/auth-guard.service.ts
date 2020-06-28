import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isLoggedIn = false;
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const url: string = state.url;
    return this.checkAuth(url);
  }

  checkAuth(url: string): boolean {
    console.log(`Is logged in: ${this.authService.isLoggedInValue}`);
    if (this.authService.isLoggedInValue) {
      return true;
    }
    this.authService.redirectUrl = url;
    this.router.navigate(['login']);

    return false;
  }

}
