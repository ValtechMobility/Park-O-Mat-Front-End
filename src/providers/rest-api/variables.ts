/*
 * variables.ts
 *
 * Created on 2019-03-19
 */

import {InjectionToken} from '@angular/core';

export const BASE_PATH = new InjectionToken<string>('basePath');
export const COLLECTION_FORMATS = {
  'csv': ',',
  'tsv': '   ',
  'ssv': ' ',
  'pipes': '|'
}
