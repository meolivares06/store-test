import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { clientResolver } from './client.resolver';

describe('clientResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => clientResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
