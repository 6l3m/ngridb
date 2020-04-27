import { TestBed } from '@angular/core/testing';

import { NgridbService } from './ngridb.service';
import { DbService } from './db.service';

describe('NgridbService', () => {
  let service: NgridbService<{ a: number; b: string }>;
  let dbService: DbService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgridbService);
    dbService = TestBed.inject(DbService);
    try {
      await dbService.openDb('test', 1, ['test']);
    } catch (error) {
      console.error(error);
    }
  });

  afterEach((done: DoneFn) => {
    const request = indexedDB.deleteDatabase('test');
    request.onsuccess = () => {
      console.log('Deleted database successfully');
      done();
    };
    request.onerror = (error) => {
      console.error('Error deleting DB', error);
      done();
    };
    request.onblocked = (evt: any) => {
      console.log('Deleting DB blocked');
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('db should not be undefined', () => {
    expect(dbService.db).not.toBeUndefined();
  });

  xit('#add should add to database and store', () => {
    const res = service.add<'b'>('test', '1');
    // expect(res).toBe({ key: 1, value: 1 });
  });
});
