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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('db should not be undefined', () => {
    expect(dbService.db).not.toBeUndefined();
  });

  xit('#add should add to database and store', () => {
    service.add<'b'>('test', '1');
  });

  afterAll(() => {
    indexedDB.deleteDatabase('test');
  });
});
