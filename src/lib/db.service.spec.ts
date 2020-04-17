import { TestBed } from '@angular/core/testing';

import { DbService } from './db.service';

describe('DbService', () => {
  let service: DbService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbService);
    try {
      const msg = await service.openDb('test', 1, ['test']);
      expect(msg).toContain('test');
    } catch (error) {
      expect(error).toContain('[NGRIDB]');
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('#openDb should return confirmation', async () => {
    try {
      const msg = await service.openDb('test', 1, ['test']);
      console.log(msg);
      expect(msg).toContain('test');
    } catch (error) {
      console.error(error);
      expect(error).toContain('[NGRIDB]');
    }
  });

  it('db should exist', () => {
    console.log('DB name: ' + service.db.name);
    expect(service.db).toBeTruthy();
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

  afterAll(() => {
    indexedDB.deleteDatabase('test');
  });
});
