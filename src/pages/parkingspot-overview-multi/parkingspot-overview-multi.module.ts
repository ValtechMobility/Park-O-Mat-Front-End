import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParkingspotOverviewMultiPage } from './parkingspot-overview-multi';
import { ParkingSpotLeftModule } from '../../components/parkingspot-left/parkingspot-left.module'
import { ParkingSpotRightModule } from '../../components/parkingspot-right/parkingspot-right.module'

@NgModule({
  declarations: [
    ParkingspotOverviewMultiPage,
  ],
  imports: [
    IonicPageModule.forChild(ParkingspotOverviewMultiPage),
    ParkingSpotLeftModule,
    ParkingSpotRightModule,
  ],
})
export class ParkingspotOverviewMultiPageModule {}
