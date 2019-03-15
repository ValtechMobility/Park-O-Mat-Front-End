import { Component, NgZone } from '@angular/core';
import { Platform, IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {ReserveRequestControllerService} from '../../providers/rest-api/api/reserveRequestController.service'

import { ParkingSpotsShare } from '../../providers/parking-spots-share/parking-spots-share';
import { SocketServiceProvider } from '../../providers/rest-api/api/socket-service';
import { ParkingSpotControllerService } from '../../providers/rest-api/api/parkingSpotController.service'

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  requestTimeoutInMilliseconds = 30000;

  freeparkingSpots: any;
  unknown: any;
  loading: any;
  blockingDone: boolean;
  onResumeSubscription: any;

  constructor(public navCtrl: NavController,
    public platform: Platform,
    public reserveRequestControllerService: ReserveRequestControllerService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public parkingSpotController: ParkingSpotControllerService,
    private parkingSpotShare: ParkingSpotsShare,
    private socketService: SocketServiceProvider,
    private zone: NgZone ) {

    this.freeparkingSpots = 'pending';
  }

  public async ionViewDidEnter(){
    this.countFreeparkingSpots();

    this.socketService.onMessage().subscribe(message => {
      this.countFreeparkingSpots();
    });

    if(!this.onResumeSubscription){
      let page = this;
      this.onResumeSubscription = this.platform.resume.subscribe(() => {
        let active = page.navCtrl.last().instance instanceof HomePage;
        if(active){
           page.parkingSpotController.allUsingGET()
               .toPromise()
               .then(data => {
                   let parkingSpots = page.parkingSpotShare.getparkingSpots();
                   for (let entry of data) {
                     parkingSpots[entry.parkingId.toString()] = entry;
                   }
                   page.parkingSpotShare.setparkingSpots(parkingSpots);
                   page.countFreeparkingSpots();
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

  public goToBlockparkingSpot() {
    let loading = null;
    setTimeout(() => {
      if(!this.blockingDone){
        loading = this.createLoadingScreen('Parkplatz blockieren...');
      }
    }, 1500);

    this.blockingDone = false;
    this.reserveRequestControllerService.reserveUsingGET()
          .toPromise()
            .then(blockedSpot => {
              this.blockingDone = true;
              if(loading != null){
                loading.dismiss();
              }
              this.storage.set("myReservedSpot", blockedSpot);
              this.navCtrl.setRoot('ParkingspotBlockedPage');
            }).catch(err => {
              this.blockingDone = true;
              if(loading != null){
                loading.dismiss();
              }
              console.log("Blocking produced an error:");
              console.log(err);
              this.doErrorAlert("Alert", "Could not block parkingspot\n" + err.error.message);
            });

    setTimeout(() => {
      if(!this.blockingDone){
        this.doErrorAlert("Timeout", "Konnte Parkplatz nicht blocken!");
      }
      if(loading != null){
        loading.dismiss();
      }
    }, this.requestTimeoutInMilliseconds);
  }

  public goToParkingSpotsOverview(){
    this.navCtrl.push('ParkingspotOverviewPage');
  }

  public countFreeparkingSpots(){

    console.log("Counting free parkingSpots");
    let fp = 0;
    let un = 0;
    let parkingSpots = this.parkingSpotShare.getparkingSpots();
    for (var key in parkingSpots) {
      if(parkingSpots[key].sensorId == '00000000' || parkingSpots[key].lastUpdated == null){
        un++;
      }
      else if(!parkingSpots[key].reserved && !parkingSpots[key].occupied){
        fp++;
      }
    }
    this.zone.run(() => {
      console.log("Free parkingSpots: " + this.freeparkingSpots);
      this.freeparkingSpots = fp;
      this.unknown = un;
    });
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
