import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, config } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  baseUrl = environment.API_ENDPOINT + "/api";

  constructor(private httpClient: HttpClient) { }

  getAll(options:any): Observable<any> {
    return this.httpClient.get<any>(environment.API_ENDPOINT + '/api/departments',
      { observe: 'response', params: options });
  }

  getOne(id: number): Observable<any> {
    return this.httpClient.get<any>(environment.API_ENDPOINT + '/api/departments/' + id,
      { observe: 'response' });
  }

  create(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.API_ENDPOINT + '/api/departments', data);
  }

  update(data: any): Observable<any> {
    return this.httpClient.put<any>(environment.API_ENDPOINT + '/api/departments', data,
      { observe: 'response' });
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/departments/${id}`);
  }
}
