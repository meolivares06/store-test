import { TestBed } from '@angular/core/testing';

import { ClientFirebaseService } from './client-firebase.service';

describe('ClientFirebaseService', () => {
  let service: ClientFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
