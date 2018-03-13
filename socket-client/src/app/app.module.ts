import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Components
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { GameComponent } from './game/game.component';
// Services
import { SocketService } from './services/socket.service';

const routes: Routes = [{
  path: '',
  component: ChatComponent
}, {
  path: '**',
  component: ChatComponent
}];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    ChatComponent,
    GameComponent
  ],
  providers: [
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
