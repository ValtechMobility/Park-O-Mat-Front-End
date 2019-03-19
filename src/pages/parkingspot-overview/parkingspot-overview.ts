/*
 * parkingspot-overview.ts
 *
 * Created on 2019-03-19
 */

import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {ParkingSpotControllerService} from '../../providers/rest-api/api/parkingSpotController.service'
import {ParkingSpotsShare} from '../../providers/parking-spots-share/parking-spots-share';

@IonicPage()
@Component({
  selector: 'page-parkingspot-overview',
  templateUrl: 'parkingspot-overview.html',
})
export class ParkingspotOverviewPage {
  requestTimeoutInMilliseconds = 30000;

  loading: any;
  initDone: boolean;
  myReservedSpot: any;
  onResumeSubscription: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public platform: Platform,
              public parkingSpotController: ParkingSpotControllerService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private storage: Storage,
              private parkingSpotShare: ParkingSpotsShare) {
    this.storage.get("myReservedSpot").then((myReservedSpot) => {
      this.myReservedSpot = myReservedSpot;
    });
  }

  ionViewDidEnter() {
    if (!this.onResumeSubscription) {
      let page = this;
      this.onResumeSubscription = this.platform.resume.subscribe(() => {
        let active = page.navCtrl.last().instance instanceof ParkingspotOverviewPage;
        if (active) {
          page.parkingSpotController.allUsingGET()
            .toPromise()
            .then(data => {
              let parkingSpots = this.parkingSpotShare.getparkingSpots();
              for (let entry of data) {
                parkingSpots[entry.parkingId.toString()] = entry;
              }
              page.parkingSpotShare.setparkingSpots(parkingSpots);

              console.log('Initializing App complete.');
            })
            .catch(err => {
              page.doErrorAlert("Error", "Daten konnten nicht geladen werden");
            });
        }
      });
    }
  }

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }

  public goToparkingSpotsOverviewMulti() {
    this.navCtrl.push('ParkingspotOverviewMultiPage');
  }

  public isCarVisible(id: number) {
    let obj = this.getparkingSpot(id);
    return obj != null && (obj.occupied || obj.reserved);
  }

  public isParkingSpotReserved(id: number) {
    return this.getparkingSpot(id) != null && !this.isMyParkingSpotReserved(id) && this.getparkingSpot(id).reserved;
  }

  public isMyParkingSpotReserved(id: number) {
    return this.getparkingSpot(id) != null && this.myReservedSpot != null && this.myReservedSpot.parkingId == id;
  }

  private getparkingSpot(id: number) {
    if (this.parkingSpotShare.getparkingSpots() != null) {
      if (this.parkingSpotShare.getparkingSpots()[id] != null) {
        return this.parkingSpotShare.getparkingSpots()[id];
      }
    }
    return null;
  }

  private doErrorAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    });

    alert.present();
  }
}
