import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'socket-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: any = {
    id: null,
    color: null
  };
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

    // user creation
    this.user.id = Math.floor(Math.random() * 1000000) + 1;
    this.user.color = (Math.floor(Math.random() * 255) + 1) +
      ',' + (Math.floor(Math.random() * 255) + 1) +
      ',' + (Math.floor(Math.random() * 255) + 1);
  }
}
