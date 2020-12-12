import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
})
export class ResetComponent implements OnInit {
  password: string;
  confirmPassword: string;
  msg: string;


  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  updatePassword() {
    if (this.password === this.confirmPassword) {
      this.authService.updatePassword(this.password);
    } else {
      this.msg = 'Las contraseñas no son iguales';
      return;
    }

    if (this.authService.isUpdatedValue) {
      this.router.navigate(['/login']);
    } else {
      this.msg = this.authService.reasonValue;
    }
  }
}
