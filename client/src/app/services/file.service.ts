import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { BehaviorSubject, Subject, Observable, ReplaySubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey, StateKey } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { _File } from '../models/file';
import { Permission } from 'permission-module';

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

  download(signedPermission: any): Observable<any> {
    return this.http.post(this.url + '/files/image/' + signedPermission.filename, signedPermission, { responseType: 'blob'});
  }

}
