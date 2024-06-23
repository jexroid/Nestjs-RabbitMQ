import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service.create({ id: "12", job: 'test', avatar: null })).toBeTruthy();
    expect(service.create({ id: '', job: 't', avatar: '' })).toThrow();
  });
});
