import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablasResultadosComponent } from './tablas-resultados.component';

describe('TablasResultadosComponent', () => {
  let component: TablasResultadosComponent;
  let fixture: ComponentFixture<TablasResultadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablasResultadosComponent]
    });
    fixture = TestBed.createComponent(TablasResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
