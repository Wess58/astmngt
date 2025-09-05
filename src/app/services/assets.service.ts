import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, config } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  baseUrl = environment.API_ENDPOINT + "/api";

  constructor(private httpClient: HttpClient) { }

  getAll(options: any): Observable<any> {
    return this.httpClient.get<any>(environment.API_ENDPOINT + '/api/assets',
      { observe: 'response', params: options });
  }

  getOne(id: number): Observable<any> {
    return this.httpClient.get<any>(environment.API_ENDPOINT + '/api/assets' + id,
      { observe: 'response' });
  }

  create(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.API_ENDPOINT + '/api/assets', data);
  }

  uploadFile(formData: FormData): Observable<any> {

    const req = new HttpRequest('POST', 'api/media/upload', formData, {
      reportProgress: true,
    });

    return this.httpClient.request(req);
  }

  update(data: any): Observable<any> {
    return this.httpClient.put<any>(environment.API_ENDPOINT + '/api/assets', data,
      { observe: 'response' });
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/assets/${id}`);
  }

  getAllAssetCategories(options: any): Observable<any> {
    return this.httpClient.get<any>(environment.API_ENDPOINT + '/api/asset-categories',
      { observe: 'response', params: options });
  }

  getOneAssetCategory(id: number): Observable<any> {
    return this.httpClient.get<any>(environment.API_ENDPOINT + '/api/asset-categories' + id,
      { observe: 'response' });
  }

  createAssetCategory(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.API_ENDPOINT + '/api/asset-categories', data);
  }

  updateAssetCategory(data: any): Observable<any> {
    return this.httpClient.put<any>(environment.API_ENDPOINT + '/api/asset-categories', data,
      { observe: 'response' });
  }

  deleteAssetCategory(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/asset-categories/${id}`);
  }
}
