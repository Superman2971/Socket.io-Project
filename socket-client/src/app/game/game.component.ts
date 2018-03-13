import { Component, OnInit, HostListener } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'socket-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  users: any[] = [];
  id: number;
  color: string;
  left: number;
  top: number;
  socketSubscription: any;
  socketSubscription2: any;

  constructor(private socketService: SocketService) {
    this.id = Math.floor(Math.random() * 1000000) + 1;
    this.color = (Math.floor(Math.random() * 255) + 1) +
      ',' + (Math.floor(Math.random() * 255) + 1) +
      ',' + (Math.floor(Math.random() * 255) + 1);
    this.left = 0;
    this.top = 0;
  }

  ngOnInit() {
    this.socketSubscription = this.socketService.onGame()
    .subscribe((gameUsers: any) => {
      this.users = gameUsers;
    });

    this.socketSubscription2 = this.socketService.onQuestion()
    .subscribe((question: any) => {
      console.log('Question', question);
    });
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    this.left = event.clientX;
    this.top = event.clientY;
    this.socketService.sendGame({
      id: this.id,
      color: this.color,
      left: this.left,
      top: this.top
    });
  }
}
