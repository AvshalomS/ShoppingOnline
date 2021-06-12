import { TestBed } from '@angular/core/testing';

import { CartAndOrdersService } from './cart-and-orders.service';

describe('CartAndOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CartAndOrdersService = TestBed.get(CartAndOrdersService);
    expect(service).toBeTruthy();
  });
});
