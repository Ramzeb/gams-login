import { TestBed } from '@angular/core/testing';

import { RotacionesService } from './rotaciones.service';

describe('RotacionesService', () => {
  let service: RotacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RotacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
