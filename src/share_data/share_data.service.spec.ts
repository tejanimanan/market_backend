import { Test, TestingModule } from '@nestjs/testing';
import { ShareDataService } from './share_data.service';

describe('ShareDataService', () => {
  let service: ShareDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShareDataService],
    }).compile();

    service = module.get<ShareDataService>(ShareDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
