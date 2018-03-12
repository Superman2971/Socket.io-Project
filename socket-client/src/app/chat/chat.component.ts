import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'socket-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  user: any;
  messages: any[] = [];
  messageContent: string;
  ioConnection: any;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
    .subscribe((message: any) => {
      this.messages.push(message);
    });

    this.socketService.onEvent('connect')
    .subscribe((data) => {
      console.log('connected', data);
    });

    this.socketService.onEvent('disconnect')
    .subscribe((data) => {
      console.log('disconnected', data);
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.user,
      content: message
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: string): void {
    let message;

    if (action === 'JOINED') {
      message = {
        from: this.user,
        action: action
      };
    } else if (action === 'RENAME') {
      message = {
        action: action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername
        }
      };
    }

    this.socketService.send(message);
  }
}
