import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellListComponent } from './sell-list.component';

describe('SellListComponent', () => {
  let component: SellListComponent;
  let fixture: ComponentFixture<SellListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
