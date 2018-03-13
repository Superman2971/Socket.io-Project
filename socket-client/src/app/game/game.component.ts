import { Component, OnInit, HostListener, Input } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'socket-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Input() user;
  users: any[] = [];
  socketSubscription: any;
  socketSubscription2: any;

  constructor(private socketService: SocketService) {}

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
    this.user.left = event.clientX;
    this.user.top = event.clientY;
    this.socketService.sendGame({
      id: this.user.id,
      color: this.user.color,
      left: this.user.left,
      top: this.user.top
    });
  }
}
