import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { fadeIn } from '../../animations';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-set-password',
  standalone: false,
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss', '../login/login.component.scss'],
  animations: [fadeIn]
})
export class SetPasswordComponent implements OnInit {

  credentials: { password: string, confirmPassword: string, resetKey: string } = {
    password: '',
    confirmPassword: '',
    resetKey: ''
  }

  logingIn = false;
  authenticationError = false;
  errorMessage: string = '';
  open = false;
  invalid = { length: false, match: false }


  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private toastService: ToastService

  ) { }

  ngOnInit(): void {
    this.credentials.resetKey = this.activatedRoute.snapshot.queryParams['key'];
  }


  setPassword(): void {
    this.authenticationError = false;
    this.logingIn = true;

    const data: any = { ...this.credentials };
    delete data.confirmPassword;

    this.usersService.setPassword(data).subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.toastService.success('Password set successfully!');

          setTimeout(() => {
            this.router.navigate(['/login'],
              {
                replaceUrl: true
              }
            );
          }, 1500);
        },
        error: (error) => {
          console.log(error);
          this.errorMessage = 'The link is no longer valid, or your account has already been activated. Please contact ICT support for assistance.';
          this.authenticationError = true;
          this.logingIn = false;
        },
      }
    )
  }

  validatePassword(): void {
    this.invalid.length = this.credentials.password.length < 8;
  }

  validateConfirmPassword(): void {
    this.invalid.match = this.credentials?.confirmPassword?.length > 0 && this.credentials.password !== this.credentials.confirmPassword;
  }

  checkPasswordInputs(): boolean {
    return !this.credentials.password.length || !this.credentials.confirmPassword.length
  }

  showPassword(id: string): void {
    const passwordInput = document.getElementById(id) as HTMLInputElement;
    this.open = !this.open;
    passwordInput.type = this.open ? 'text' : 'password';
  }

}
