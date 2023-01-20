import { Component } from '@angular/core';
import { FileService } from './services/file.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EA-BackOffice';

  public displayLoader: Observable<boolean> = this.fileService.isLoading();
  constructor(private fileService: FileService) {}
}
