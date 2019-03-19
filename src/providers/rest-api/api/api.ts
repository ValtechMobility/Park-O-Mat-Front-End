/*
 * api.ts
 *
 * Created on 2019-03-19
 */

export * from './parkingSpotController.service';
import {ParkingSpotControllerService} from './parkingSpotController.service';
import {ReserveRequestControllerService} from './reserveRequestController.service';

export * from './reserveRequestController.service';

export const APIS = [ParkingSpotControllerService, ReserveRequestControllerService];
