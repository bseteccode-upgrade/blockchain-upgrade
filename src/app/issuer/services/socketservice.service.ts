/*
 * File : socketservice.service.ts
 * Use: Socket service using for certificate image dynamically view
 * Copyright : vottun 2019
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as SocketIOClient from '../../../../node_modules/socket.io-client/dist/socket.io.js';

@Injectable()
export class SocketserviceService {

  private socket: SocketIOClient.Socket;
  constructor() {
    this.socket = SocketIOClient('https://test.vottun.com:3003');
  }

  onNewMessage() {
    return Observable.create(observer => {
      this.socket.on('new_message', msg => {
        observer.next(msg);
      });
    });
  }

  sendMessage(userID) {
    this.socket.emit('change_username', { username: userID });
  }

  disconnectSocket() {
    this.socket.disconnect();
  }
}
