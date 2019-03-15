import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Configuration } from './configuration';

import { ParkingSpotControllerService } from './api/parkingSpotController.service';
import { ReserveRequestControllerService } from './api/reserveRequestController.service';
import { SocketServiceProvider } from './api/socket-service';
import { BASE_PATH } from './variables';

@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [],
  exports:      [],
  providers: [
    { provide: BASE_PATH, useValue: "<url>"},
    ParkingSpotControllerService,
    ReserveRequestControllerService,
    SocketServiceProvider
  ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [
              { provide: Configuration, useFactory: configurationFactory }
            ]
        }
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import your base AppModule only.');
        }
    }
}
