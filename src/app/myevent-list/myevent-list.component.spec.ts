import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyeventListComponent } from './myevent-list.component';

describe('MyeventListComponent', () => {
  let component: MyeventListComponent;
  let fixture: ComponentFixture<MyeventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyeventListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyeventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
