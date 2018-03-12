import { Component, HostListener } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'socket-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  color: string;
  left: number;
  top: number;

  constructor(private socketService: SocketService) {
    this.color = (Math.floor(Math.random() * 255) + 1) +
      ',' + (Math.floor(Math.random() * 255) + 1) +
      ',' + (Math.floor(Math.random() * 255) + 1);
    this.left = 0;
    this.top = 0;
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
  }
}
