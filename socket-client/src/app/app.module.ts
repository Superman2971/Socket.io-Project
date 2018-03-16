import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { GameComponent } from './game/game.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
// Services
import { SocketService } from './services/socket.service';
import { ApiService } from './services/api.service';

const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: '**',
  component: HomeComponent
}];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    ChatComponent,
    GameComponent,
    ScoreboardComponent
  ],
  providers: [
    SocketService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
