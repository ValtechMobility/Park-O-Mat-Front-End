/*
 * parkingspot-blocked.ts
 *
 * Created on 2019-03-19
 */

import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {ReserveRequestControllerService} from '../../providers/rest-api/api/reserveRequestController.service'

/**
 * Generated class for the parkingSpotBlockedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


// TODO: Calculate timer correctly. Show timer correctly

@IonicPage()
@Component({
  selector: 'page-parkingspot-blocked',
  templateUrl: 'parkingspot-blocked.html',
})
export class ParkingspotBlockedPage {
  requestTimeoutInMilliseconds = 30000;

  hasFinished: boolean;
  secondsRemaining: number;

  loading: any;
  parkingSpotBlockedId = "N/A";
  reservationToken: string;
  timeBlocked = "0:00 min";
  blockingReleaseDone = false;
  onResumeSubscription: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public reserveRequestControllerService: ReserveRequestControllerService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private storage: Storage) {
  }

  ionViewDidEnter() {
    this.initializeView();
    if (!this.onResumeSubscription) {
      let page = this;
      this.onResumeSubscription = this.platform.resume.subscribe(() => {
        let active = page.navCtrl.last().instance instanceof ParkingspotBlockedPage;
        if (active) {
          page.initializeView();
        }
      });
    }
  }

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }

  initializeView() {
    console.log("ParkingSpot Blocked View did load");
    this.storage.get("myReservedSpot").then((myReservedSpot) => {
      this.parkingSpotBlockedId = myReservedSpot.parkingId;
      this.reservationToken = myReservedSpot.reservationToken;

      let todayDate = new Date().getTime();
      let reservationEndDate = new Date(myReservedSpot.endTime);

      this.secondsRemaining = (reservationEndDate.getTime() - todayDate) / 1000;
      this.timeBlocked = this.getSecondsAsDigitalClock(this.secondsRemaining) + " min";

      this.hasFinished = false;
      this.timerTick();

    }).catch(() => {
      console.log("No reserved Spot")
    });
  }

  releaseparkingSpotAndGoToHome() {
    if (this.parkingSpotBlockedId == null) {
      this.doErrorAlert("Error", "Kein Parkplatz reserviert!");
      this.navCtrl.setRoot('HomePage');
    }

    let loading = null;
    setTimeout(() => {
      if (!this.blockingReleaseDone) {
        loading = this.createLoadingScreen();
      }
    }, 1500);

    this.blockingReleaseDone = false;

    this.reserveRequestControllerService.releaseUsingPUT(this.parkingSpotBlockedId, this.reservationToken)
      .toPromise()
      .then(data => {
        console.log("Released ParkingSpot response:");
        console.log(data);
        this.hasFinished = true;
        this.storage.remove("myReservedSpot");
        this.blockingReleaseDone = true;
        if (loading != null) {
          loading.dismiss();
        }
        this.navCtrl.setRoot('HomePage');
      }).catch(err => {
      this.hasFinished = true;
      this.blockingReleaseDone = true;
      if (loading != null) {
        loading.dismiss();
      }
      console.error('Got an error while releasing parkingspot: ');
      console.error(err);
      console.error(err.error.message);
      this.doErrorAlert("Error", "Dein Parkplatz konnte nicht freigegeben werden!\n" + err.error.message);
    });

    setTimeout(() => {
      if (!this.blockingReleaseDone) {
        this.doErrorAlert("Timeout", "Dein Parkplatz konnte nicht freigegeben werden!");
      }
      if (loading != null) {
        loading.dismiss();
      }
    }, this.requestTimeoutInMilliseconds);
  }

  goToParkingSpotsOverview() {
    this.navCtrl.push('ParkingspotOverviewPage');
  }

  private doErrorAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    });

    alert.present();
  }

  private createLoadingScreen() {
    let loading = this.loadingCtrl.create({
      content: 'Parkplatz freigeben...'
    });

    loading.present();

    return loading;
  }


  private getSecondsAsDigitalClock(inputSeconds: number) {
    let sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
    let minutesString = '';
    let secondsString = '';
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return minutesString + ':' + secondsString;
  }


  private timerTick() {
    setTimeout(() => {
      if (this.hasFinished) {
        return;
      }
      this.secondsRemaining--;
      this.timeBlocked = this.getSecondsAsDigitalClock(this.secondsRemaining) + " min";
      if (this.secondsRemaining > 0) {
        this.timerTick();
      } else {
        this.hasFinished = true;
        this.doErrorAlert("Expired", "Your reservation expired!");
        this.storage.remove("myReservedSpot");
        this.navCtrl.setRoot('HomePage');

      }
    }, 1000);
  }

}
