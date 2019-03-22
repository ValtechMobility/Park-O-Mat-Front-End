/*
 * parkingspot-overview.module.ts
 *
 * Created on 2019-03-19
 */

import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ParkingspotOverviewPage} from './parkingspot-overview';
import {ParkingSpotLeftModule} from '../../components/parkingspot-left/parkingspot-left.module'
import {ParkingSpotRightModule} from '../../components/parkingspot-right/parkingspot-right.module'

@NgModule({
  declarations: [
    ParkingspotOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ParkingspotOverviewPage),
    ParkingSpotLeftModule,
    ParkingSpotRightModule,
  ],
})
export class ParkingspotOverviewPageModule {
}
