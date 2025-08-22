import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
import { style, animate, transition, trigger } from '@angular/animations';
import { MENUS_WITH_PATHS } from "../../app.constants";
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
  ) {
    router.events.subscribe((val) => {

      // if (val instanceof ActivationEnd && !this.currentUser?.id) {
      //   // console.log(val);
      //   this.currentUser = JSON.parse(sessionStorage.getItem('astuser') || '{}');
      //   // console.log(this.currentUser);
      //   this.userHomeUrl = this.currentUser?.menus?.length ? this.menusList.find((menu: any) => menu.title === this.currentUser?.menus[0])?.path : '';

      // }

    });
  }

  ngOnInit(): void {
  }


  logout(): void {
    this.router.navigate(['/login']);
    this.currentUser = {};

    sessionStorage.removeItem('hftoken');
    sessionStorage.removeItem('astuser');
    localStorage.removeItem('url');

    setTimeout(() => {
      location.reload();
    }, 10);

  }

}
