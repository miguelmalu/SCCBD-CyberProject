import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { Observable } from 'rxjs';

@Component({
 selector: 'app-list-files',
 templateUrl: './list-files.component.html',
 styleUrls: ['./list-files.component.css']
})
export class ListFilesComponent {

/*  public fileList$: Observable<string[]> = this.fileService.list();

 constructor(private fileService: FileService) { }

 public download(fileName: string):  void {
   this.fileService.download(fileName);
 }

 public remove(fileName: string):  void {
   this.fileService.remove(fileName);
 } */
}
