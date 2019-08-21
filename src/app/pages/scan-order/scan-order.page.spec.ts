import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanOrderPage } from './scan-order.page';

describe('ScanOrderPage', () => {
  let component: ScanOrderPage;
  let fixture: ComponentFixture<ScanOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
