import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, config } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = environment.API_ENDPOINT + "/api";

  constructor(private httpClient: HttpClient) { }

  loginUser(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/users/auth`, data);
  }

  getUsers(options: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/users`,
      { observe: "response", params: options }
    );
  }

  getOneUser(id: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/users/${id}`,
      { observe: "response" }
    );
  }

  createUser(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/users`, data);
  }

  updateUser(data: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/users`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/users/${id}`);
  }

}
