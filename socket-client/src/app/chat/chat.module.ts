import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Components
import { ChatComponent } from './chat.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ChatComponent],
  providers: []
})
export class ChatModule { }
