import { TestBed } from '@angular/core/testing';

import { ClientStoreService } from './client-store.service';

describe('ClientManagerService', () => {
  let service: ClientStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
