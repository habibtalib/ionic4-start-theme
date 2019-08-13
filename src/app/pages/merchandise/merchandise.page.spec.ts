import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandisePage } from './merchandise.page';

describe('MerchandisePage', () => {
  let component: MerchandisePage;
  let fixture: ComponentFixture<MerchandisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchandisePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
