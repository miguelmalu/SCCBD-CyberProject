import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { BehaviorSubject, Subject, Observable, ReplaySubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey, StateKey } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { _File } from '../models/file';
import { Permision } from 'permission-module';

@Injectable({
 providedIn: 'root'
})
export class FileService {
  
  private url = environment.apiURL + '/api';

  constructor(private http: HttpClient) { }

  upload(file: File, owner: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('owner', owner);
    console.log(formData.getAll)

    return this.http.post(this.url + '/files/', formData, {
      reportProgress: true,
      responseType: 'json'
    });
  }

  getAllFiles(): Observable<_File[]> {
    return this.http.get<_File[]>(this.url + '/files');
  }

  getFile(fileName: string): Observable<_File> {
    return this.http.get<_File>(this.url + '/files/file/' + fileName);
  }

  download(signedPermision: any): Observable<any> {
  /*    let test = "test"
   let params = new HttpParams();
    params = params.append('permision', JSON.stringify(permision));
    params = params.append('signedContent', JSON.stringify(signedContent));
    console.log(params) */
    return this.http.post(this.url + '/files/image/' + signedPermision.filename, signedPermision, { responseType: 'blob'});

/*   let params = new HttpParams();
  params = params.append('data', JSON.stringify(data));
  return this.http.get<any>('https://some-api.com/data', {params}); */

/*   getData(data: object): Observable<any> {
    return this.http.get<any>('https://some-api.com/data', {
      observe: 'response',
      params: new HttpParams().set('access_token', 'token'),
      body: data
    });
  } */


  }

}
