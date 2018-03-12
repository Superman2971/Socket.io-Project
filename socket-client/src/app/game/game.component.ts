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
      console.log(gameUsers);
      this.users = gameUsers;
    });
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const code = event.keyCode;
    if (code === 37) { // left
      this.left -= 2;
    } else if (code === 39) { // right
      this.left += 2;
    } else if (code === 38) { // top
      this.top -= 2;
    } else if (code === 40) { // down
      this.top += 2;
    }
    this.socketService.sendGame({
      id: this.id,
      color: this.color,
      left: this.left,
      top: this.top
    });
  }
}
