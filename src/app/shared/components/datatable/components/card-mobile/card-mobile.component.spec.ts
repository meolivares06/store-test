import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMobileComponent } from './card-mobile.component';

describe('CardMobileComponent', () => {
  let component: CardMobileComponent;
  let fixture: ComponentFixture<CardMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
