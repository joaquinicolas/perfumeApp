import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isUserLoggedIn: boolean;
  title: string;
  isMenuVisible: boolean;

  constructor(private authService: AuthService) {
    this.title = 'Fragancias';
    this.isMenuVisible = true;
  }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((value) => {
      console.log(`is logged in: ${value}`);
      this.isUserLoggedIn = value;
    });
  }

}
