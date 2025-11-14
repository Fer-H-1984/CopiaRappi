import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const mockAuthService = {
  validateUser: jest.fn(),
  login: jest.fn(),
};

const mockUsersService = {
  create: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should validate the user and return login result', async () => {
      const dto = { email: 'test@test.com', password: '1234' };

      mockAuthService.validateUser.mockResolvedValue({ id: 1 });
      mockAuthService.login.mockResolvedValue({ token: 'abc123' });

      const result = await controller.login(dto);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );

      expect(mockAuthService.login).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ token: 'abc123' });
    });
  });

  describe('create (register)', () => {
    it('should call UsersService.create and return its result', async () => {
      const dto = { email: 'new@test.com', password: '1234' };

      mockUsersService.create.mockResolvedValue({ id: 99 });

      const result = await controller.create(dto);

      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 99 });
    });
  });
});