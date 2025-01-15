import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMobileSellComponent } from './card-mobile-sell.component';

describe('CardMobileSellComponent', () => {
  let component: CardMobileSellComponent;
  let fixture: ComponentFixture<CardMobileSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMobileSellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMobileSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
