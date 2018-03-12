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
    this.initModel();
  }

  private initModel(): void {
    const randomId = (Math.floor(Math.random() * (1000000)) + 1);
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

  onClickUserInfo(name) {
    let data;
    if (this.user.name) {

    } else {
      data = {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: 'edit'
      };
    }

    // Hit API
    // this.dialogRef.afterClosed().subscribe(paramsDialog => {
    //   if (!paramsDialog) {
    //     return;
    //   }

    //   this.user.name = paramsDialog.username;
    //   if (paramsDialog.dialogType === 'new') {
    //     this.initIoConnection();
    //     this.sendNotification(paramsDialog, 'joined');
    //   } else if (paramsDialog.dialogType === 'edit') {
    //     this.sendNotification(paramsDialog, 'rename');
    //   }
    // });
  }
}
