/*
 * reserveRequestController.service.ts
 *
 * Created on 2019-03-19
 */

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
/* tslint:disable:no-unused-variable member-ordering */

import {Inject, Injectable, Optional} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {CustomHttpUrlEncodingCodec} from '../encoder';

import {Observable} from 'rxjs/Observable';

import {ResponseEntity} from '../model/responseEntity';

import {BASE_PATH} from '../variables';
import {Configuration} from '../configuration';


@Injectable()
export class ReserveRequestControllerService {

  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  protected basePath: string;

  constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * release
   *
   * @param parkingId parkingId
   * @param reservationToken reservationToken
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public releaseUsingPUT(parkingId: string, reservationToken?: string, observe?: 'body', reportProgress?: boolean): Observable<ResponseEntity>;

  public releaseUsingPUT(parkingId: string, reservationToken?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseEntity>>;

  public releaseUsingPUT(parkingId: string, reservationToken?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseEntity>>;

  public releaseUsingPUT(parkingId: string, reservationToken?: string, observe: any = 'body', reportProgress: boolean = false): Observable<any> {
    if (parkingId === null || parkingId === undefined) {
      throw new Error('Required parameter parkingId was null or undefined when calling releaseUsingPUT.');
    }

    let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
    if (reservationToken !== undefined) {
      queryParameters = queryParameters.set('reservationToken', <any>reservationToken);
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      '*/*'
    ];
    let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [
      'application/json'
    ];

    return this.httpClient.put<ResponseEntity>(`${this.basePath}/release/${encodeURIComponent(String(parkingId))}`,
      null,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * reserve
   *
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public reserveUsingGET(observe?: 'body', reportProgress?: boolean): Observable<ResponseEntity>;

  public reserveUsingGET(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseEntity>>;

  public reserveUsingGET(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseEntity>>;

  public reserveUsingGET(observe: any = 'body', reportProgress: boolean = false): Observable<any> {

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      '*/*'
    ];
    let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [
      'application/json'
    ];

    return this.httpClient.get<ResponseEntity>(`${this.basePath}/reserve`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (let consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

}
