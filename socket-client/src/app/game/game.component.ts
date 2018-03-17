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
  @Input() question: any = {
    category: null,
    answers: null,
    question: null,
    type: null
  };
  // question: any = {
  //   category: 'Entertainment: Video Games',
  //   answers: [
  //     'Mario Kart: Double Dash',
  //     'Mario Kart 64',
  //     'Super Mario Kart'
  //   ],
  //   question: 'Which ones of these Mario Kart games was made for the Gameboy Advance?',
  //   type: 'multiple'
  // };
  selectedAnswer: any;
  scoreboard: any;
  socketSubscription: any;
  socketSubscription2: any;
  clock: number;
  timer: any;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketSubscription = this.socketService.onGame()
    .subscribe((gameUsers: any) => {
      this.users = gameUsers;
    });

    this.socketSubscription2 = this.socketService.onQuestion()
    .subscribe((question: any) => {
      if (this.selectedAnswer) {
        console.log('send answer', this.selectedAnswer);
        this.socketService.sendAnswer({
          id: this.user.socket,
          name: this.user.name,
          answer: this.selectedAnswer
        });
      }
      this.question = question;
      console.log('Question', question);
      this.selectedAnswer = null;
      this.initCountdown();
    });
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    this.user.left = event.clientX;
    this.user.top = event.clientY;
    this.socketService.sendGame({
      socket: this.user.socket,
      id: this.user.id,
      color: this.user.color,
      left: this.user.left,
      top: this.user.top
    });
  }

  clickedAnswer(answer) {
    if (!answer) {
      return;
    }
    if (this.selectedAnswer === answer) {
      this.selectedAnswer = null;
    } else {
      this.selectedAnswer = answer;
    }
  }

  initCountdown() {
    clearInterval(this.timer); // ensure previous timer is cleared
    this.clock = 30; // reset to 30 seconds
    this.timer = setInterval(() => {
      --this.clock;
      if (this.clock <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }
}
