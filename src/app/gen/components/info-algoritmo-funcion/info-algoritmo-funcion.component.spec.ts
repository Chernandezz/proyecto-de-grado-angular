import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAlgoritmoFuncionComponent } from './info-algoritmo-funcion.component';

describe('InfoAlgoritmoFuncionComponent', () => {
  let component: InfoAlgoritmoFuncionComponent;
  let fixture: ComponentFixture<InfoAlgoritmoFuncionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoAlgoritmoFuncionComponent]
    });
    fixture = TestBed.createComponent(InfoAlgoritmoFuncionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
