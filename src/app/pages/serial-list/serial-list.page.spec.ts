import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialListPage } from './serial-list.page';

describe('SerialListPage', () => {
  let component: SerialListPage;
  let fixture: ComponentFixture<SerialListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
