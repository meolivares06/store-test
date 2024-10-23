import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TableLazyLoadEvent} from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class ClientHttpService {
  httpClient = inject(HttpClient);
  apiUrl = 'https://fakeapidata.com/users';

  constructor() { }

  loadAllPaginated(param: TableLazyLoadEvent): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}?page=1&limit=15`);
  }
}
