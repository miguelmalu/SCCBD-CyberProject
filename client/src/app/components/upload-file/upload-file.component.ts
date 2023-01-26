import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileService } from '../../services/file.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
 selector: 'app-upload-file',
 templateUrl: './upload-file.component.html',
 styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;

  username!: string

  constructor(private uploadService: FileService,
              private router: Router, ) { }
  ngOnInit(): void {
    this.fileInfos = this.uploadService.getAllFiles();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

/*   download(fileName: string): void {
    this.uploadService.download(fileName);
 } */

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        this.username = localStorage.getItem('username')!;
        this.uploadService.upload(this.currentFile, this.username).subscribe({
          next: (event: any) => {
/*             if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) { */
              console.log("before calling this.message")
              /* this.message = event.body.message; */
              console.log("before calling getFiles")
              this.fileInfos = this.uploadService.getAllFiles();
              /* this.router.navigate(['/list-users']); */
            /* } */
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }

}
