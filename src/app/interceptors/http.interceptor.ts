import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router, ActivationEnd, ActivationStart } from '@angular/router';
import { UsersService } from '../services/users.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  currentUser: any = JSON.parse(sessionStorage.getItem('asmuser') || '{}');


  constructor(private router: Router,
    private usersService: UsersService

  ) {

    router.events.subscribe((val) => {

      const checkUrl = !this.router.routerState.snapshot.url.includes('login') &&
        !this.router.routerState.snapshot.url.includes('reset-password') && (val instanceof ActivationEnd || val instanceof ActivationStart);

      if (!sessionStorage.getItem('asmtoken') && checkUrl) {
        setTimeout(() => {
          this.usersService.logout();
        }, 100);
      }

      if (checkUrl && this.currentUser?.menus?.length && val.snapshot?.data['menuCode']?.length) {
        // console.log(val?.snapshot?.data);
        // console.log(this.currentUser?.menus);

        const hasRoutePermit = val.snapshot.data['menuCode'].some((code: any) =>
          this.currentUser?.menus?.includes(code)
        );
        // console.log(hasRoutePermit);

        if (!hasRoutePermit) {
          this.usersService.logout();
        }
      }
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (

      req.url.includes('login')
    ) {
      return next.handle(req);
    }
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // 'Content-Type': 'multipart/form-data',
    };

    const token = sessionStorage.getItem('asmtoken');

    const request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          // || err.status === 403
          if (!this.router.routerState.snapshot.url.includes('login')) {
            sessionStorage.removeItem('asmtoken');
            sessionStorage.removeItem('asmuser');
            localStorage.setItem('url', this.router.routerState.snapshot.url)

            this.router.navigate(['/login']);
            setTimeout(() => {
              location.reload();
            }, 10);

          }
        }
        // const error = err.error.message || err.statusText;
        return throwError(err.error);
      })
    );
  }
}
