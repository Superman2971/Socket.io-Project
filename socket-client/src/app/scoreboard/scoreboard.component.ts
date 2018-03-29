import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'socket-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  @Input() scores: any;
  socketSubscription: any;
  socketSubscription2: any;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketSubscription = this.socketService.onScoreboard()
    .subscribe((scores: any) => {
      this.scores = scores;
    });
    this.socketSubscription2 = this.socketService.onScore()
    .subscribe((score: any) => {
      console.log('SCORE', score);
    });
  }
}
