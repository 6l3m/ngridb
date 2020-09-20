import { TestBed } from '@angular/core/testing';

import { take } from 'rxjs/operators';

import { NgridbService } from './ngridb.service';

import { NgridbModule } from './ngridb.module';

interface State {
  a: number;
  b: string;
}

describe('NgridbService', () => {
  let service: NgridbService<State>;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    NgridbModule.register<State>('db-test', 1, ['a', 'b']);
    service = TestBed.inject(NgridbService);
  });

  afterEach((done: DoneFn) => {
    const request = indexedDB.deleteDatabase('test');
    request.onsuccess = () => {
      console.log('👍 Deleted database successfully');
      done();
    };
    request.onerror = (error) => {
      console.error('👎 Error deleting DB', error);
      done();
    };
    request.onblocked = () => {
      console.log('⛔️ Deleting DB blocked');
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#add should add to database and store', async () => {
    await service.add('b', '1');
    await service.add('a', 1);
    await service.add('a', 2);
    const res1 = await service.select<number[]>('a').pipe(take(1)).toPromise();
    expect(res1).toEqual([1, 2]);
    const res2 = await service.select<string>('b').pipe(take(1)).toPromise();
    expect(res2).toBe('1');
  });
});
