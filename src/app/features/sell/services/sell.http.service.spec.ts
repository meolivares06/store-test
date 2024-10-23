import { TestBed } from '@angular/core/testing';

import { SellHttpService } from './sell.http.service';

describe('SellHttpService', () => {
  let service: SellHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
