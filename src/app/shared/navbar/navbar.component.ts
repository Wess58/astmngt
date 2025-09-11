import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';
import { MENUS_WITH_PATHS } from "../../app.constants";
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(600, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class NavbarComponent implements OnInit {

  currentUser: any = {
    name: 'John Doe',
    role: {
      code: 'Admin'
    }
  };
  menusList: any[] = MENUS_WITH_PATHS;
  userHomeUrl: string = '';

  constructor(
    public router: Router,
    private usersService: UsersService
  ) {
    router.events.subscribe((val) => {

      if (val instanceof ActivationEnd && !this.currentUser?.id) {
        // console.log(val);
        this.currentUser = JSON.parse(sessionStorage.getItem('asmuser') || '{}');
        console.log(this.currentUser);
        // this.userHomeUrl = this.currentUser?.menus?.length ? this.menusList.find((menu: any) => menu.title === this.currentUser?.menus[0])?.path : '';
      }

    });
  }

  ngOnInit(): void {
  }

  showNavbar(): boolean {
    return !this.router.url.includes('login') && !this.router.url.includes('reset-password');
  }

  logout(): void {
    this.usersService.logout();
    this.currentUser = {};
  }

}
