import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck, map, tap } from 'rxjs/operators';

import { DbService } from './db.service';

import { IDBEntry } from './idbEntry.interface';

type IDBState<State> = {
  [K in keyof State]: IDBEntry<State[K]>;
};

@Injectable({
  providedIn: 'root',
})
/**
 * Service managing application state depending on database entries.
 */
export class NgridbService<State> {
  private subject = new BehaviorSubject<IDBState<State>>({} as IDBState<State>);
  store = this.subject.asObservable().pipe(distinctUntilChanged());

  constructor(private dbService: DbService) {}

  /**
   * Emits the value stored in the application state.
   * @param name Name of property to emit. Allows nested properties.
   */
  select<T>(...name: string[]): Observable<T> {
    return this.store.pipe(
      map((idbState: IDBState<State>) =>
        Object.keys(idbState).reduce(
          (acc, curr) =>
            Array.isArray(idbState[curr])
              ? {
                  ...acc,
                  [curr]: idbState[curr].map(
                    (idbEntry: IDBEntry<any>) => idbEntry.value
                  ),
                }
              : { ...acc, [curr]: idbState[curr].value },
          {}
        )
      ),
      pluck(...name)
    );
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
      const res: IDBEntry<State[a]>[] = await this.dbService.addDb(
        [dbStore || key],
        value
      );
      // DB Stored keys of state object are also stored in application for retrieval.
      this.subject.next({
        ...this.subject.value,
        [key]: this.subject.value[key]
          ? Array.isArray(this.subject.value[key])
            ? [
                ...((this.subject.value[key] as unknown) as IDBEntry<
                  State[a]
                >[]),
                res[0],
              ]
            : [this.subject.value[key], res[0]]
          : res[0],
      });
    } catch (error) {
      console.error(error);
    }
  }
}
