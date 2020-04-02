import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgridbComponent } from './ngridb.component';

describe('NgridbComponent', () => {
  let component: NgridbComponent;
  let fixture: ComponentFixture<NgridbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgridbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgridbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
