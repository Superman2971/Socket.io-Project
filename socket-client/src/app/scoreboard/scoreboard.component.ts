import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'socket-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  scores: any;
  socketSubscription: any;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketSubscription = this.socketService.onScoreboard()
    .subscribe((scores: any) => {
      console.log('scoreboard', scores);
      this.scores = scores;
    });
  }
}
