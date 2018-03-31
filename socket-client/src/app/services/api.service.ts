import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiService {
  attempts = 0;

  constructor(
    private http: HttpClient
  ) {}

  private setHeaders(params?): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (params) {
      headersConfig['params'] = params;
    }
    return new HttpHeaders(headersConfig);
  }

  private formatErrors(error: any) {
    return Observable.throw(error.error);
  }

  private get(path: string, params?: object): Observable<any> {
    const header: any = {
      headers: this.setHeaders()
    };
    if (params) {
      header.params = params;
    }
    return this.http.get(`${environment.api_url}${path}`, header)
    .catch((error: any) => this.formatErrors(error))
    .map((res) => res);
  }

  public getInitialInfo(): Observable<any> {
    return this.get('/getscores');
  }
}
