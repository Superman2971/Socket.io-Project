import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as firebase from 'firebase';
const https = require('https');

export class ChatServer {
  public static readonly PORT:number = 3080;
  private app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;
  private gameUsers: any[] = [];
  private gameQuestions: any[] = [];
  private previousQuestion: any;
  private currentQuestion: any;
  // private scoreboard: any[] = [];

  constructor() {
    this.createApp();
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
    this.getQuestions();
    this.changeApiAccess();
    this.defineRoutes();
    this.initializeFirebase();
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
      console.log('Connected client', socket.id);
      // set up the subscriptions
      socket.on('message', (m: any) => {
        // console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });
      socket.on('game', (g: any) => {
        // console.log('[server](game): %s', JSON.stringify(g));
        this.characterMove(g);
      });
      socket.on('answer', (answer: any) => {
        // console.log('[server](answer): %s', JSON.stringify(answer));
        this.checkUserAnswer(answer);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        let userId = this.gameUsers.findIndex((gameUser) => { return gameUser.socket === socket.id; });
        if (userId !== -1) {
          this.gameUsers.splice(userId, 1);
        }
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

  private getQuestions(attempt?) {
    https.get('https://opentdb.com/api.php?amount=10', (response) => {
      let data = '';
      // A chunk of data has been recieved.
      response.on('data', (chunk) => {
        // console.log('CHUNK', chunk);
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      response.on('end', () => {
        if (data !== '') {
          let parsedData = JSON.parse(data);
          // console.log('RESPONSE', data, parsedData);
          if (parsedData.results) {
            this.gameQuestions = parsedData.results;
            // console.log('Questions Response: ', this.gameQuestions);
            this.serveQuestions();
          } else {
            console.log('JSON.parse Error: ', data);
            this.failedGetQuestions(attempt);
          }
        } else {
          this.failedGetQuestions(attempt);
        }
      });
    }).on('error', (err) => {
      console.log('ERROR', err);
    });
  }

  private failedGetQuestions(attempt?) {
    if (attempt) {
      if (attempt > 4) {
        // 5 failed attempts, what now? Temporarily will just make it serve the same 10 questions
        this.serveQuestions();
      } else {
        attempt++;
        this.getQuestions(attempt);
      }
    } else {
      this.getQuestions(1);
    }
  }

  private serveQuestions() {
    let index = 0;
    let interval = setInterval(() => {
      // console.log('serve', index, this.gameQuestions[index]);
      if (index < this.gameQuestions.length) {
        this.previousQuestion = this.currentQuestion;
        this.currentQuestion = this.gameQuestions[index];
        let q: any = {
          category: this.gameQuestions[index].category,
          answers: this.shuffle(this.gameQuestions[index].incorrect_answers, this.gameQuestions[index].correct_answer),
          question: this.gameQuestions[index].question,
          type: this.gameQuestions[index].type
        }
        console.log('Answer: ', this.gameQuestions[index].correct_answer);
        this.io.emit('question', q);
        // send scoreboard after 3 seconds
        setTimeout(() => {
          firebase.database().ref('score').orderByChild('score').limitToLast(10).once('value', (data) => {
            let scores: Array<any> = [];
            let snap: any = data.val();
            for (let item in snap) {
              scores.push(snap[item]);
            }
              scores.sort((a, b) => {
                return (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0);
              }).reverse();
            this.io.emit('scoreboard', scores);
          });
        }, 3000);
      } else {
        clearInterval(interval);
        this.getQuestions();
      }
      index++;
    }, 30000);
  }

  private shuffle(answerArray, correctAnswer) {
    if (!answerArray || !correctAnswer) {
      return [];
    } else if (answerArray.indexOf(correctAnswer) === -1) {
      answerArray.push(correctAnswer); // push correct answer into incorrect answer (for some reason this return the new length)
      let currentIndex = answerArray.length;
      let temporaryValue;
      let randomIndex;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = answerArray[currentIndex];
        answerArray[currentIndex] = answerArray[randomIndex];
        answerArray[randomIndex] = temporaryValue;
      }
      return answerArray;
    } else {
      return answerArray;
    }
  }

  private checkUserAnswer(user) {
    if (this.previousQuestion && user) {
      // console.log(user.answer, this.previousQuestion.correct_answer);
      if (this.previousQuestion.correct_answer === user.answer) {
        this.updateUserScore(user);
      }
    }
  }

  private updateUserScore(user) {
    let userDbInfo: any;
    firebase.database().ref('score/' + user.id).once('value', (data) => {
      userDbInfo = data.val();
      if (userDbInfo) {
        firebase.database().ref('score/' + user.id).set({
          id: user.id,
          name: user.name,
          score: userDbInfo.score + 10
        });
        this.io.to(user.id).emit('score', userDbInfo.score + 10);
      } else {
        firebase.database().ref('score/' + user.id).set({
          id: user.id,
          name: user.name,
          score: 10
        });
        this.io.to(user.id).emit('score', 10);
      }
    });
  }

  private changeApiAccess() {
    // Add headers
    this.app.use(function (req, res, next) {
      let allowedOrigins = ['http://socket-questions.bitballoon.com', 'http://localhost:4200'];
      let origin = req.headers.origin;
      if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', true);
      return next();
    });
  }

  private defineRoutes() {
    // route to get scores for newly joining users
    this.app.get('/getscores', (req, res) => {
      firebase.database().ref('score').orderByChild('score').limitToLast(10).once('value', (data) => {
        let scores: Array<any> = [];
        let snap: any = data.val();
        for (let item in snap) {
          scores.push(snap[item]);
        }
        scores.sort((a, b) => {
          return (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0);
        }).reverse();
        if (this.currentQuestion) {
          res.send({
            scoreboard: scores,
            question: {
              category: this.currentQuestion.category,
              answers: this.shuffle(this.currentQuestion.incorrect_answers, this.currentQuestion.correct_answer),
              question: this.currentQuestion.question,
              type: this.currentQuestion.type
            }
          });
        } else {
          res.send({
            scoreboard: scores
          });
        }
      });
    });
    // route to manually reset the cursors on screen
    this.app.get('/resetcursors', (req, res) => {
      this.gameUsers = [];
      this.io.emit('game', this.gameUsers);
      res.send({reset: 'success'});
    });
  }

  private initializeFirebase() {
    // Initialize Firebase
    var config = {
      apiKey: 'AIzaSyA06i7uEZDVQE3TbjWwoLH9ctoxFpyZQVA',
      authDomain: 'socket-qa.firebaseapp.com',
      databaseURL: 'https://socket-qa.firebaseio.com',
      projectId: 'socket-qa',
      storageBucket: 'socket-qa.appspot.com',
      messagingSenderId: '615361684672'
    };
    firebase.initializeApp(config);
  }

  public getApp(): express.Application {
    return this.app;
  }
}
