import {
  NgModule,
  ModuleWithProviders,
  APP_INITIALIZER,
  InjectionToken,
} from '@angular/core';

import { NgridbComponent } from './ngridb.component';

import { DbService } from './db.service';
import { Statement } from '@angular/compiler';

const NAME = new InjectionToken<string>('NGRIDB_REGISTER_NAME');
const VERSION = new InjectionToken<number>('NGRIDB_REGISTER_VERSION');
const STORES = new InjectionToken<number>('NGRIDB_REGISTER_STORES');

export function ngridbAppInitializer(
  name: string,
  version: number,
  stores: string[],
  dbService: DbService
) {
  const initializer = async () => {
    try {
      const msg = await dbService.openDb(name, version, stores);
      console.log(msg);
    } catch (error) {
      console.error(error);
    }
  };
  return initializer;
}

@NgModule({
  declarations: [NgridbComponent],
  imports: [],
  exports: [NgridbComponent],
})
export class NgridbModule {
  static register<State>(
    name: string,
    version: number
  ): ModuleWithProviders<NgridbModule> {
    // console.log(State);
    return {
      ngModule: NgridbModule,
      providers: [
        { provide: NAME, useValue: name },
        { provide: VERSION, useValue: version },
        {
          provide: STORES,
          useValue: Object.keys('state'),
        },
        {
          provide: APP_INITIALIZER,
          useFactory: ngridbAppInitializer,
          deps: [NAME, VERSION, STORES, DbService],
          multi: true,
        },
      ],
    };
  }
}
