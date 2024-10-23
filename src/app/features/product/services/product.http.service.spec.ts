import { TestBed } from '@angular/core/testing';

import { ProductHttpService } from './product.http.service';

describe('ProdeuctService', () => {
  let service: ProductHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
