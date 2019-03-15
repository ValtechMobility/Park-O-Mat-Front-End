import { Component } from '@angular/core';
import { Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import {ParkingSpot} from '../providers/rest-api/model/parkingSpot'
import { ParkingSpotsShare } from '../providers/parking-spots-share/parking-spots-share';
import { ParkingSpotControllerService } from '../providers/rest-api/api/parkingSpotController.service'

import { SocketServiceProvider } from '../providers/rest-api/api/socket-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  loading: any;
  initDone: boolean;

  constructor(private storage: Storage,
    private parkingSpotShare: ParkingSpotsShare,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public parkingSpotController: ParkingSpotControllerService,
    private socketService: SocketServiceProvider) {

    platform.ready().then(() => {
      console.log("Platform ready");
      this.loadData();
    });
  }

  private async loadData() {
    let loading = null;

    if(this.platform.is('core')){
      loading = this.createLoadingScreen('Lade daten...');
    }

    await this.parkingSpotController.allUsingGET()
        .toPromise()
        .then(data => {
            let parkingSpots = this.parkingSpotShare.getparkingSpots();
            for (let entry of data) {
              parkingSpots[entry.parkingId.toString()] = entry;
            }
            this.parkingSpotShare.setparkingSpots(parkingSpots);

            console.log('Initializing App complete.');
        })
        .catch(err => {
            this.doErrorAlert("Error", "Daten konnten nicht geladen werden");
        });

    await this.checkParkingSpotInStorage();
    await this.socketService.initializeSocket();

    if (this.platform.is('core') && loading != null){
      loading.dismiss();
    } else {
      this.hideSplashscreen();
    }
  }

  private async checkParkingSpotInStorage(){
    this.storage.get("myReservedSpot").then((myReservedSpot) => {
      if(myReservedSpot != null) {
        this.validateReservation(myReservedSpot);
      }else{
        this.rootPage = "HomePage";
      }
    }).catch(() => {
      this.rootPage = "HomePage";
    });
  }

  private validateReservation(myReservedSpot: ParkingSpot){
    this.rootPage = "ParkingspotBlockedPage";
    let reservationEndDate = new Date(myReservedSpot.endTime);

    let todayDate = new Date().getTime();

    if(todayDate > reservationEndDate.getTime()){
      this.rootPage = "HomePage";
      this.storage.remove("myReservedSpot");
    }
  }

  private hideSplashscreen(){
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }

  private doErrorAlert(title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    });

    alert.present();
  }

  private createLoadingScreen(msg: string){
    let loading = this.loadingCtrl.create({
      content: msg
    });

    loading.present();

    return loading;
  }
}
