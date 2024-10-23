import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCrudComponent } from './base-crud.component';

describe('BaseCrudComponent', () => {
  let component: BaseCrudComponent;
  let fixture: ComponentFixture<BaseCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
