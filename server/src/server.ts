import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
const https = require('https');

export class ChatServer {
  public static readonly PORT:number = 8080;
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;
  private gameUsers: any[] = [];
  private gameQuestions: any[] = [];

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
    this.getQuestions();
  }

  private createApp(): void {
    this.app = express();
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private config(): void {
    this.port = process.env.PORT || ChatServer.PORT;
  }

  private sockets(): void {
    this.io = socketIo(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on('connect', (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      socket.on('message', (m: any) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });
      socket.on('game', (g: any) => {
        console.log('[server](message): %s', JSON.stringify(g));
        this.characterMove(g);
        // this.io.emit('game', g);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  private characterMove(user) {
    let userId = this.gameUsers.findIndex((gameUser) => { return gameUser.id === user.id; });
    if (userId === -1) {
      this.gameUsers.push(user);
    } else {
      this.gameUsers[userId] = user;
    }
    this.io.emit('game', this.gameUsers);
  }

  private getQuestions() {
    https.get('https://opentdb.com/api.php?amount=10', (response) => {
      let data = '';
      // A chunk of data has been recieved.
      response.on('data', (chunk) => {
        // console.log('CHUNK', chunk);
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      response.on('end', () => {
        // console.log('RESPONSE', data, JSON.parse(data));
        this.gameQuestions = JSON.parse(data).results;
        console.log(this.gameQuestions);
        this.serveQuestions();
      });
    }).on("error", (err) => {
      console.log('ERROR', err);
    });
  }
  public getApp(): express.Application {
    return this.app;
  }

  private serveQuestions() {
    let index = 0;
    let interval = setInterval(() => {
      console.log('serve', index, this.gameQuestions[index]);
      if (index < this.gameQuestions.length) {
        this.io.emit('question', this.gameQuestions[index]);
      } else {
        clearInterval(interval); // future this won't clear but instead aquire more questions
      }
      index++;
    }, 5000);
  }
}
