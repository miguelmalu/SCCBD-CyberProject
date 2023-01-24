import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { BehaviorSubject, Subject, Observable, ReplaySubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey, StateKey } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { _File } from '../models/file';

@Injectable({
 providedIn: 'root'
})
export class FileService {
  
  private url = environment.apiURL + '/api';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(this.url + '/files/', formData, {
      reportProgress: true,
      responseType: 'json'
    });
  }

  getFiles(): Observable<_File[]> {
    return this.http.get<_File[]>(this.url + '/files');
  }

  //No acaba de funcionar
  download(fileName: string): void {
   this.http.get(this.url + '/files/image/' + fileName, { responseType: 'blob'}).subscribe(res => {
     window.open(window.URL.createObjectURL(res));
   });
 }

}
