import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarPin } from './verificar-pin';

describe('VerificarPin', () => {
  let component: VerificarPin;
  let fixture: ComponentFixture<VerificarPin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarPin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarPin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
