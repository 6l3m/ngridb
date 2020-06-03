import { TestBed } from '@angular/core/testing';

import { DbService } from './db.service';

describe('DbService', () => {
  let service: DbService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbService);
    try {
      await service.openDb('test', 1, ['test']);
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

  it('db should exist', () => {
    expect(service.db).toBeDefined();
  });

  it('#addDb should return object(s)', async () => {
    try {
      const result = await service.addDb(['test'], { a: 1 });
      expect(result).toEqual([{ key: 1, value: { a: 1 } }]);
    } catch (error) {
      console.error(error);
      expect(error).toContain('[NGRIDB]');
    }
  });

  it('#getDb should retrieve object', async () => {
    await service.addDb(['test'], { a: 1 });
    try {
      const result = await service.getDb(['test'], 1);
      expect(result).toEqual([{ a: 1 }]);
    } catch (error) {
      console.error(error);
      expect(error).toContain('[NGRIDB]');
    }
  });
});
