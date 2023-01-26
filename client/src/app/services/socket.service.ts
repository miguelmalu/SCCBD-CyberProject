import { Injectable } from '@angular/core';
import { Permission } from 'permission-module';
import { BehaviorSubject, Observable } from 'rxjs';
const io = require('socket.io-client');
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {}

  socket = io(environment.apiURL);

  public sendMessage(message:any) {
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message', (message:any) =>{
      this.message$.next(message);
    });
    return this.message$.asObservable();
  };
}