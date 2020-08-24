import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsPage } from './points.page';

describe('PointsPage', () => {
  let component: PointsPage;
  let fixture: ComponentFixture<PointsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
