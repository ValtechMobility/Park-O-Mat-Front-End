/*
 * parkingspot-left.ts
 *
 * Created on 2019-03-19
 */

import {Component, Input} from '@angular/core';
import {Storage} from '@ionic/storage';

/**
 * Generated class for the ParkingspotLeftComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'parkingspot-left',
  templateUrl: 'parkingspot-left.html'
})
export class ParkingspotLeftComponent {

  @Input() parkingSpot: any;
  @Input() parkingId: any;
  private myReservedSpot: any;

  constructor(private storage: Storage) {
    this.storage.get("myReservedSpot").then((myReservedSpot) => {
      this.myReservedSpot = myReservedSpot;
    });
  }

  public backendHasDataAboutParkingSpot() {
    return this.parkingSpot != null && (this.parkingSpot.sensorId != '00000000' || this.parkingSpot.lastUpdated != null);
  }

  public isCarVisible() {
    return this.parkingSpot != null && (this.parkingSpot.occupied || this.parkingSpot.reserved);
  }

  public isParkingSpotReserved() {
    return this.parkingSpot != null && !this.isMyParkingSpotReserved() && this.parkingSpot.reserved;
  }

  public isMyParkingSpotReserved() {
    return this.parkingSpot != null && this.myReservedSpot != null && this.myReservedSpot.parkingId == this.parkingSpot.parkingId;
  }
}
