import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAlgoritmoAsignacionComponent } from './info-algoritmo-asignacion.component';

describe('InfoAlgoritmoAsignacionComponent', () => {
  let component: InfoAlgoritmoAsignacionComponent;
  let fixture: ComponentFixture<InfoAlgoritmoAsignacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoAlgoritmoAsignacionComponent]
    });
    fixture = TestBed.createComponent(InfoAlgoritmoAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
