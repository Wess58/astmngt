import { Component } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { MENUS_WITH_PATHS } from '../../app.constants';

@Component({
  selector: 'app-side-nav',
  standalone: false,
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  currentUser: any = {};
  menusList: any[] = MENUS_WITH_PATHS;
  userHomeUrl: string = '';


  constructor(
    public router: Router,
  ) {
    router.events.subscribe((val) => {

      if (val instanceof ActivationEnd && !this.currentUser?.id) {
        // console.log(val);
        this.currentUser = JSON.parse(sessionStorage.getItem('asmuser') || '{}');
        // console.log(this.currentUser);
        this.userHomeUrl = this.currentUser?.menus?.length ? this.menusList.find((menu: any) => menu.title === this.currentUser?.menus[0])?.path : '';

      }

    });
  }
}
