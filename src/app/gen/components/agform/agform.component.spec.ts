import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AGFormComponent } from './agform.component';

describe('AGFormComponent', () => {
  let component: AGFormComponent;
  let fixture: ComponentFixture<AGFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AGFormComponent]
    });
    fixture = TestBed.createComponent(AGFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
