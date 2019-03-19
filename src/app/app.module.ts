/*
 * app.module.ts
 *
 * Created on 2019-03-19
 */

import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {IonicStorageModule} from '@ionic/storage';

import {MyApp} from './app.component';
import {ApiModule} from '../providers/rest-api'
import {ParkingSpotsShare} from '../providers/parking-spots-share/parking-spots-share';
import {SocketServiceProvider} from '../providers/rest-api/api/socket-service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    ApiModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ParkingSpotsShare,
    SocketServiceProvider,
  ]
})
export class AppModule {
}
