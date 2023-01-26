import { Injectable } from '@angular/core';
import { Permision } from 'permission-module';
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
    /* console.log("33: " + message.filename) */
    console.log("sendMessage")
    console.log(message)

/*     if (typeof message == "bigint") {
      message = message.toString()
      console.log("90: " + message.type)
    } */
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message', (message:any) =>{
      console.log("getNewMessage")
      console.log(message)
      this.message$.next(message);
      console.log("20: " + message.filename)
    });
/*     console.log("2: " + this.message$.asObservable()) */
    return this.message$.asObservable();
  };
}