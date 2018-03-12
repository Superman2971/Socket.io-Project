import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
// Shared Modules
import { ChatModule } from './chat/chat.module';
// Components
import { AppComponent } from './app.component';
// Services
import { SocketService } from './services/socket.service';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChatModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
