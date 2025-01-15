import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFormComponent } from './base-form.component';

describe('EntityFormComponent', () => {
  let component: BaseFormComponent<any>;
  let fixture: ComponentFixture<BaseFormComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
