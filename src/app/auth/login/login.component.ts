import { Component, OnInit, ElementRef } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MENUS_WITH_PATHS } from "../../app.constants";
import { ApiService } from '../../services/api.service';
import { UsersService } from '../../services/users.service';
import { fadeIn } from '../../animations';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeIn]
})
export class LoginComponent implements OnInit {
  username!: ElementRef;

  login: any = {};
  stage: string = 'getOTPStage';
  otpError = false;
  otpErrorMessage: string = '';
  timeOut: any[] = [];
  time: string = '';
  open = false;
  logingIn = false;
  resendError = false;
  authenticationError = false;
  menuList: any[] = MENUS_WITH_PATHS;
  errorMessage: string = '';


  constructor(
    private apiService: ApiService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    // this.getRoleMatrix();
    if (sessionStorage.getItem('asmtoken')) {
      this.getAccount();
    }
  }

  loginUser(): void {
    this.authenticationError = false;
    this.logingIn = true;

    sessionStorage.removeItem('asmtoken');
    sessionStorage.removeItem('asmuser');
    localStorage.removeItem('url');

    const data = {
      username: this.login.username,
      password: this.login.password
    }

    this.usersService.loginUser(data).subscribe(
      {
        next: (res) => {
          // console.log(res);
          sessionStorage.setItem('asmtoken', res.token);
          this.getAccount();
        },
        error: (error) => {
          console.log(error);

          if (error?.error?.code === 401) {
            this.errorMessage = 'Your account has been deactivated. Please contact ICT support for assistance.';
          } else {
            this.errorMessage = 'Please check your username or password and try again.';
          }

          this.authenticationError = true;
          this.logingIn = false;
        },
      }
    )
  }




  getAccount(): void {
    this.usersService.getAccount().subscribe(
      {
        next: (res) => {
          // console.log(res);
          sessionStorage.setItem('asmuser', JSON.stringify(res));
          // const redirectUrl = this.menuList.find((menu: any) => menu.title === res.body.menus[0])?.path;
          this.router.navigateByUrl(localStorage.getItem('url') ?? '/assets', { replaceUrl: true });
        
        },
        error: (error) => {
          console.log(error);
          this.logingIn = false;
        }
      }
    )
  }


  resendOTP(): void {

    const data = {
      twoFACode: this.login.twoFACode,
    }

    // this.apiService.resendOTP(data).subscribe(
    //   {
    //     next: (res: any) => {
    //       console.log(res);

    //       this.clearTimeOut();
    //       this.countDown(60);
    //     },
    //     error: (error) => {
    //       console.log(error);

    //       if (error?.error?.code === 401) {
    //         this.errorMessage = error?.error?.message;
    //       } else {
    //         this.errorMessage = 'Try again later';
    //       }

    //       this.authenticationError = true;
    //       this.logingIn = false;
    //     }
    //   }
    // )
  }

  back(): void {
    this.clearTimeOut();

    this.stage = 'getOTPStage';
    this.login = {};

    this.resendError = false;
    this.otpError = false;
    this.authenticationError = false;
    this.errorMessage = '';
    this.logingIn = false;
  }


  countDown(time: any): void {
    this.timeOut = [];
    for (let i = time; i >= 0; i--) {
      this.timeOut.push(
        setTimeout(() => {
          this.time = String(i);
          // console.log(this.time);

          if (this.time.length === 1) {
            this.time = '0' + this.time;
            // console.log(this.time);
          }
        }, (time - i) * 1000)
      );
    }
  }

  clearTimeOut(): void {
    this.time = '00';
    if (this.timeOut) {
      this.timeOut.forEach((timer: any) => {
        clearTimeout(timer);
      });
    }
  }

  showPassword(): void {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    // console.log('passwordInput', passwordInput);
    this.open = !this.open;
    passwordInput.type = this.open ? 'text' : 'password';
  }



}
