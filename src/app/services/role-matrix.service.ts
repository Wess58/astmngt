import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, config } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RoleMatrixService {

  baseUrl = environment.API_ENDPOINT + "/api";

  constructor(private httpClient: HttpClient) { }

  getRoles(): Observable<any> {
    return this.httpClient.get<any>(environment.API_ENDPOINT + '/api/roles',
      { observe: 'response' });
  }

  getRoleMatrix(): Observable<any> {
    return this.httpClient.get<any>(environment.API_ENDPOINT + '/api/roles/role-matrix',
      { observe: 'response' });
  }

  getMenusAndOperations(): Observable<any> {
    return this.httpClient.get<any>(environment.API_ENDPOINT + '/api/roles/menus-and-operations',
      { observe: 'response' });
  }

  createRole(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.API_ENDPOINT + '/api/roles', data);
  }

  updateRole(data: any): Observable<any> {
    return this.httpClient.put<any>(environment.API_ENDPOINT + '/api/roles', data,
      { observe: 'response' });
  }
}
