import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Components
import { ChatComponent } from './chat.component';
import { GameComponent } from '../game/game.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ChatComponent,
    GameComponent
  ],
  providers: []
})
export class ChatModule { }
