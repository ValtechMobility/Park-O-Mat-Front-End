/*
 * socket-service.ts
 *
 * Created on 2019-03-19
 */

import {Inject, Injectable, Optional} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {BASE_PATH} from '../variables';

import {ParkingSpotsShare} from '../../parking-spots-share/parking-spots-share';
import {ParkingSpot} from '../model/parkingSpot';

import * as SockJS from 'sockjs-client';

@Injectable()
export class SocketServiceProvider {
  protected basePath: string;
  private socketChannel = "/parking-spot-updates";
  private ws: SockJS;

  constructor(public parkingSpotShare: ParkingSpotsShare,
              @Optional() @Inject(BASE_PATH) basePath: string) {
    if (basePath) {
      this.basePath = basePath;
    }

    this.basePath += this.socketChannel;
  }

  public initializeSocket() {
    return new Promise((resolve) => {
      let sp = this;
      this.ws = new SockJS(this.basePath);

      this.ws.onopen = function () {
        console.log("Websocket opened, thus resolving promise");
        sp.onMessage().subscribe(message => {
        });
        resolve();
      };
    });
  }

  public onMessage() {
    let observable = new Observable((observer) => {
      if (this.ws) {
        let pss = this.parkingSpotShare;
        this.ws.onmessage = function (e) {
          // Get the content
          if (e.data == 'Welcome! You are now connected to the server. This is the first message.') {
            console.log(e.data);
          } else {
            let content: ParkingSpot;
            content = <ParkingSpot>JSON.parse(e.data);
            pss.updateParkingSpot(content.parkingId, content);
            observer.next(content);
          }
        };
      }
    })
    return observable;
  }
}
