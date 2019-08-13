import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenealogyPage } from './genealogy.page';

describe('GenealogyPage', () => {
  let component: GenealogyPage;
  let fixture: ComponentFixture<GenealogyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenealogyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenealogyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
