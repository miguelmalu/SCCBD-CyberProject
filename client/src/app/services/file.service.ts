import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { BehaviorSubject, Subject, Observable, ReplaySubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey, StateKey } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Injectable({
 providedIn: 'root'
})
export class FileService {
  
  private url = environment.apiURL + '/api';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.url}/files/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.url}/files`);
  }



/* url = environment.apiURL + '/api';
 private fileList: string[] = new Array<string>();
 private fileList$: Subject<string[]> = new ReplaySubject<string[]>(1);
 private displayLoader$: Subject<boolean> = new BehaviorSubject<boolean>(false);

 constructor(
  private http: HttpClient,
  @Optional() @Inject('LIST_FILES') private listFiles: (callback: any) => void,
  @Inject(PLATFORM_ID) private platformId: any,
  private transferState: TransferState
  ) {
   const transferKey: StateKey<string[]> = makeStateKey<string>('fileList');
   if (isPlatformServer(this.platformId)) {
    this.listFiles((err: any, files: string[]) => {
      this.fileList = files;
      this.transferState.set(transferKey, this.fileList);
    });
   } else {
     this.fileList = this.transferState.get<string[]>(transferKey, []);
   }
   this.fileList$.next(this.fileList);
 }
 

 public isLoading(): Observable<boolean> {
   return this.displayLoader$;
 }

 public upload(fileName: string, fileContent: string): void {
  this.displayLoader$.next(true);
   this.http.post(this.url + '/files', {name: fileName, content: fileContent})
   .pipe(finalize(() => this.displayLoader$.next(false)))
   .subscribe(res => {
     this.fileList.push(fileName);
     this.fileList$.next(this.fileList);
   }, error => {
     this.displayLoader$.next(false);
   });
 }

 public download(fileName: string): void {
   this.http.get(this.url + '/files/' + fileName, { responseType: 'blob'}).subscribe(res => {
     window.open(window.URL.createObjectURL(res));
   });
 }

 public remove(fileName: string): void {
   this.http.delete(this.url + '/files/'  + fileName).subscribe(() => {
     this.fileList.splice(this.fileList.findIndex(name => name === fileName), 1);
     this.fileList$.next(this.fileList);
   });
 }

 public list(): Observable<string[]> {
   return this.fileList$;
 }

 private addFileToList(fileName: string): void {
   this.fileList.push(fileName);
   this.fileList$.next(this.fileList);
 } */
}
