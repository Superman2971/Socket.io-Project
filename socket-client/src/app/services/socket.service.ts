import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class SocketService {
  private socket;

  constructor() {}

  initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  send(message: any): void {
    this.socket.emit('message', message);
  }

  onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('message', (data: any) => observer.next(data));
    });
  }

  onEvent(event: string): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
