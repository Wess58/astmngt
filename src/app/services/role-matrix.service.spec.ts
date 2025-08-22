import { TestBed } from '@angular/core/testing';

import { RoleMatrixService } from './role-matrix.service';

describe('RoleMatrixService', () => {
  let service: RoleMatrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleMatrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
