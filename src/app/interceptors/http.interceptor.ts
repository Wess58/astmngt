import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router, ActivationEnd, ActivationStart } from '@angular/router';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  currentUser: any = JSON.parse(sessionStorage.getItem('astuser') || '{}');


  constructor(private router: Router) {

    router.events.subscribe((val) => {
      if (!this.router.routerState.snapshot.url.includes('login') && (val instanceof ActivationEnd || val instanceof ActivationStart)
        && this.currentUser?.menus?.length && val.snapshot?.data['menuCode']?.length) {
        // console.log(val?.snapshot?.data);
        // console.log(this.currentUser?.menus);

        const hasRoutePermit = val.snapshot.data['menuCode'].some((code: any) =>
          this.currentUser?.menus?.includes(code)
        );

        // console.log(hasRoutePermit);

        if (!hasRoutePermit) {
          sessionStorage.removeItem('hftoken');
          sessionStorage.removeItem('astuser');
          localStorage.removeItem('url');
          this.router.navigate(['/login']);
          setTimeout(() => {
            location.reload();
          }, 10);
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

    const token = sessionStorage.getItem('hftoken');
    // const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwZXRlciIsImV4cCI6MTczNjMxOTI0OH0.EdzX6MptbhkEW4nP3OORey7KHn7Pdb_wl-gnLfJ1WiFxF6dXom1uhP8vJgygzhbs3GSVZckkyJK8SymA2cRemg";


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
            sessionStorage.removeItem('hftoken');
            sessionStorage.removeItem('astuser');
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
