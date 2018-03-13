import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'socket-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private socketService: SocketService) {
    this.socketService.initSocket();

    this.socketService.onEvent('connect')
    .subscribe((data) => {
      console.log('connected', data);
    });

    this.socketService.onEvent('disconnect')
    .subscribe((data) => {
      console.log('disconnected', data);
    });
  }
}
