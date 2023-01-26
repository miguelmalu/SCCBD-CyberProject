import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileService } from '../../services/file.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
 selector: 'app-files',
 templateUrl: './files.component.html',
 styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  message = '';

  fileInfos?: Observable<any>;

  username!: string

  constructor(private fileService: FileService,
              private router: Router, ) { }
  ngOnInit(): void {
    this.fileInfos = this.fileService.getAllFiles();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        this.username = localStorage.getItem('username')!;
        this.fileService.upload(this.currentFile, this.username).subscribe({
          next: (event: any) => {
              this.fileInfos = this.fileService.getAllFiles();
          },
          error: (err: any) => {
            console.log(err);

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
