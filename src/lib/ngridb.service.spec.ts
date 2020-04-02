import { TestBed } from '@angular/core/testing';

import { NgridbService } from './ngridb.service';

describe('NgridbService', () => {
  let service: NgridbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgridbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
