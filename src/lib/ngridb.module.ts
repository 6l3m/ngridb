import {
  NgModule,
  ModuleWithProviders,
  APP_INITIALIZER,
  InjectionToken,
} from '@angular/core';

import { NgridbComponent } from './ngridb.component';

import { DbService } from './db.service';

export const NAME = new InjectionToken<string>('NGRIDB_REGISTER_NAME');
export const VERSION = new InjectionToken<number>('NGRIDB_REGISTER_VERSION');
export const STORES = new InjectionToken<string>('NGRIDB_REGISTER_STORES');

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
  static register(
    name: string,
    version: number,
    stores: string[]
  ): ModuleWithProviders<NgridbModule> {
    return {
      ngModule: NgridbModule,
      providers: [
        { provide: NAME, useValue: name },
        { provide: VERSION, useValue: version },
        { provide: STORES, useValue: stores },
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
