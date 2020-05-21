import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck, map } from 'rxjs/operators';

import { DbService } from './db.service';
import { IDBEntry } from './idbEntry.interface';

@Injectable({
  providedIn: 'root',
})
/**
 * Service managing application state depending on database entries.
 */
export class NgridbService<State> {
  private subject = new BehaviorSubject<State>({} as State);
  store = this.subject.asObservable().pipe(distinctUntilChanged());

  constructor(private dbService: DbService) {}

  /**
   * Emits the value stored in the application state.
   * @param name Name of property to emit. Allows nested properties.
   */
  select<T>(...name: string[]): Observable<T> {
    return this.store.pipe(pluck(...name), map((res: T) => res.value || ));
  }

  /**
   * Stores data in database as well as application state.
   * @param key Key of application state to hydrate.
   * @param value Value of data to be written in store.
   * @param dbStore (Optional) Object store of database to write into.
   * Key will be taken as name of store if null.
   */
  async add<a extends keyof State>(
    key: a & string,
    value: State[a],
    dbStore?: string
  ): Promise<void> {
    try {
      const res: IDBEntry[] = await this.dbService.addDb([dbStore || key], value);
      // DB Stored keys of state object are also stored in application for retrieval.
      this.subject.next({
        ...this.subject.value,
        [key]: this.subject.value[key]
          ? [...((this.subject.value[key] as unknown) as State[a][]), res[0]]
          : res[0],
      });
    } catch (error) {
      console.error(error);
    }
  }
}
