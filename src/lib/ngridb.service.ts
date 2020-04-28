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
  private subject = new BehaviorSubject<State>({} as State);
  store = this.subject.asObservable().pipe(distinctUntilChanged());

  constructor(private dbService: DbService) {}

  select<T>(...name: string[]): Observable<T> {
    return this.store.pipe(pluck(...name));
  }

  /**
   * Stores data in database as well as application state.
   * @param dbStore Object store of database to write into.
   * @param value Value of data to be written in store.
   */
  add<a extends keyof State>(
    key: a & string,
    value: State[a],
    dbStore?: string
  ): void {
    this.dbService.addDb([dbStore || key], value).then((res: any[]) => {
      this.subject.next({ ...this.subject.value, [key]: res[0].value });
      console.log(this.subject.value);
    });
  }
}
