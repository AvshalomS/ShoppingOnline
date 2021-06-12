import { TestBed, async, inject } from '@angular/core/testing';

import { IsUserGuard } from './is-user.guard';

describe('IsUserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsUserGuard]
    });
  });

  it('should ...', inject([IsUserGuard], (guard: IsUserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
