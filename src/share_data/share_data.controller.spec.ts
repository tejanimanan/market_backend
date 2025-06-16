import { Test, TestingModule } from '@nestjs/testing';
import { ShareDataController } from './share_data.controller';

describe('ShareDataController', () => {
  let controller: ShareDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShareDataController],
    }).compile();

    controller = module.get<ShareDataController>(ShareDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
