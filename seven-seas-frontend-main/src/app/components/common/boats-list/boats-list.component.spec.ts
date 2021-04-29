import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatsListComponent } from './boats-list.component';

describe('BoatsListComponent', () => {
  let component: BoatsListComponent;
  let fixture: ComponentFixture<BoatsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
