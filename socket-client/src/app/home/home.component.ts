import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ApiService } from '../services/api.service';

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
  initScoreboard: any;
  initQuestion: any = {
    category: null,
    answers: null,
    question: null,
    type: null
  };

  constructor(
    private socketService: SocketService,
    private api: ApiService
  ) {
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

    // Set initial question and scoreboard
    this.grabInitialData();
  }

  grabInitialData() {
    console.log('make the call');
    // Call for initial questions and scoreboard
    this.api.getInitialInfo().subscribe((data) => {
      console.log('data', data);
      this.initScoreboard = data.scoreboard;
      this.initQuestion = data.question;
    }, (err) => {
      console.log('err', err);
    });
  }
}
