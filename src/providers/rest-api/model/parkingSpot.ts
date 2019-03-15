/**
 * Parkplatz
 * Nice API
 *
 * OpenAPI spec version: 0.0.1
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


export interface ParkingSpot {
    batteryVoltage?: number;
    endTime?: string;
    occupied?: boolean;
    parkingId?: string;
    reservationToken?: string;
    reserved?: boolean;
    rssi?: number;
    sensorId?: string;
    startTime?: string;
    user?: string;
    lastUpdated?: string;
}
