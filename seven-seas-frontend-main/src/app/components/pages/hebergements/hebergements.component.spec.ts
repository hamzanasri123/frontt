import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HebergementsComponent } from './hebergements.component';

describe('HebergementsComponent', () => {
  let component: HebergementsComponent;
  let fixture: ComponentFixture<HebergementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HebergementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HebergementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
