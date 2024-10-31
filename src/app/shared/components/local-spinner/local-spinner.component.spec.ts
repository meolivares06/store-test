import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalSpinnerComponent } from './local-spinner.component';

describe('LocalSpinnerComponent', () => {
  let component: LocalSpinnerComponent;
  let fixture: ComponentFixture<LocalSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalSpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
