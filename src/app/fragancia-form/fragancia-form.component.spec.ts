import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FraganciaFormComponent } from './fragancia-form.component';

describe('FraganciaFormComponent', () => {
  let component: FraganciaFormComponent;
  let fixture: ComponentFixture<FraganciaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FraganciaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FraganciaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
