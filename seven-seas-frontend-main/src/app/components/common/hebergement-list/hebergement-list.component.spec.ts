import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HebergementListComponent } from './hebergement-list.component';

describe('HebergementListComponent', () => {
  let component: HebergementListComponent;
  let fixture: ComponentFixture<HebergementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HebergementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HebergementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
