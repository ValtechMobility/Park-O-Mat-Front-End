/*
 * parking-spots-share.ts
 *
 * Created on 2019-03-19
 */

import {Injectable} from '@angular/core';

/*
  Generated class for the InitLoad ParkingSpotsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ParkingSpotsShare {

  parkingSpots = [];

  constructor() {
  }

  public setparkingSpots(parkingSpots_: any) {
    this.parkingSpots = parkingSpots_;
  }

  public getparkingSpots() {
    return this.parkingSpots;
  }

  public updateParkingSpot(id: string, parkingSpot: any) {
    this.parkingSpots[id] = parkingSpot;
  }

}
