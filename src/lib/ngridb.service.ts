import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

import { DbService } from './db.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Service managing application state depending on database entries.
 */
export class NgridbService<State> {
  private subject = new BehaviorSubject<any>(null);
  store = this.subject.asObservable().pipe(distinctUntilChanged());

  constructor(private dbService: DbService) {}

  select<T>(...name: string[]): Observable<T> {
    return this.store.pipe(pluck(...name));
  }

  /**
   * Stores data in database as well as application state.
   * @param dbStore Object store of database to write into.
   * @param data Data to be written in store.
   */
  add<a extends keyof State>(dbStore: string, key: State[a]): void {
    this.dbService.addDb([dbStore], key).then((res: any[]) => {
      console.log(res);
    });
  }
}
