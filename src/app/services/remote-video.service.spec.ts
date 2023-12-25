import { TestBed } from '@angular/core/testing';

import { RemoteVideoService } from '../services/remote-video.service';

describe('RemoteVideoService', () => {
  let service: RemoteVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
