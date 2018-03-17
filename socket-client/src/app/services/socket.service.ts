import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as socketIo from 'socket.io-client';
import { environment } from '../../environments/environment';

const SERVER_URL = `${environment.api_url}`;

@Injectable()
export class SocketService {
  public socket;
  socketId: undefined;

  constructor() {}

  initSocket(): void {
    this.socket = socketIo(SERVER_URL);
    this.socketId = this.socket.id;
  }

  sendMessage(message: any): void {
    this.socket.emit('message', message);
  }

  onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('message', (data: any) => observer.next(data));
    });
  }

  sendGame(game: any): void {
    this.socket.emit('game', game);
  }

  onGame(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('game', (data: any) => observer.next(data));
    });
  }

  onQuestion(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('question', (data: any) => observer.next(data));
    });
  }

  sendAnswer(answer: any): void {
    this.socket.emit('answer', answer);
  }

  onScoreboard(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('scoreboard', (data: any) => observer.next(data));
    });
  }

  onEvent(event: string): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}
