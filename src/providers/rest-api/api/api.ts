export * from './parkingSpotController.service';
import { ParkingSpotControllerService } from './parkingSpotController.service';
export * from './reserveRequestController.service';
import { ReserveRequestControllerService } from './reserveRequestController.service';
export const APIS = [ParkingSpotControllerService, ReserveRequestControllerService];
