import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'socket-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  user: any = {};
  userInput: string;
  messages: any[] = [];
  messageContent: string;
  chatSubscription: any;

  constructor(private socketService: SocketService) {
    this.chatSubscription = this.socketService.onMessage()
    .subscribe((message: any) => {
      this.messages.push(message);
    });
  }

  ngOnInit(): void {
    this.initUser();
  }

  private initUser(): void {
    let params;
    this.user.id = (Math.floor(Math.random() * (1000000)) + 1);
    this.user.name = ('guest' + this.user.id);
    params = {
      username: this.user.name,
      previousUsername: undefined
    };
    this.sendNotification(params, 'joined');
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.sendMessage({
      from: this.user,
      content: message
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: string): void {
    let message;

    if (action === 'joined') {
      message = {
        from: this.user,
        action: action
      };
    } else if (action === 'renamed') {
      message = {
        action: action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername
        }
      };
    }
    this.socketService.sendMessage(message);
  }

  onClickUserInfo(name) {
    let params;
    params = {
      username: name,
      previousUsername: this.user.name
    };
    this.user.name = name;
    this.sendNotification(params, 'renamed');
    this.userInput = null;
  }
}
