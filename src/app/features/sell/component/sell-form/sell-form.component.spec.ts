import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellFormComponent } from './sell-form.component';

describe('SellFormComponent', () => {
  let component: SellFormComponent;
  let fixture: ComponentFixture<SellFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
