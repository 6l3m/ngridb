import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';

import { NgridbComponent } from './ngridb.component';

import { DbService } from './db.service';

export function ngridbAppInitializer(
  name: string,
  version: number,
  stores: string[],
  dbService: DbService
) {
  return (): Promise<any> => dbService.openDb(name, version, stores);
}

@NgModule({
  declarations: [NgridbComponent],
  imports: [],
  exports: [NgridbComponent]
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
        {
          provide: APP_INITIALIZER,
          useFactory: ngridbAppInitializer,
          deps: [name, version, stores, DbService],
          multi: true
        }
      ]
    };
  }
}
