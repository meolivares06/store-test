import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSkeletonComponent } from './general-skeleton.component';

describe('GeneralSkeletonComponent', () => {
  let component: GeneralSkeletonComponent;
  let fixture: ComponentFixture<GeneralSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
