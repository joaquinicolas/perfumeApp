import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: string;
  passwd: string;
  msg: string;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onLoginClick() {
    this.authService.login(this.user, this.passwd);
    if (!this.authService.isLoggedInValue) {
      this.msg = 'Credenciales erroneas';
    }
    if (this.authService.redirectUrl) {
      this.router.navigate([this.authService.redirectUrl]);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
