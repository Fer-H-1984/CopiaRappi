import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsMethodsController } from './payments-methods.controller';
import { PaymentsMethodsService } from './payments-methods.service';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('../../shared/utils/parameters-validation', () => ({
  validateParameters: jest.fn(),
}));

import { validateParameters } from '../../shared/utils/parameters-validation';

describe('PaymentsMethodsController', () => {
  let controller: PaymentsMethodsController;

  const mockPaymentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsMethodsController],
      providers: [
        {
          provide: PaymentsMethodsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsMethodsController>(PaymentsMethodsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // CREATE
  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto = { name: 'Test' };

      mockPaymentsService.create.mockResolvedValue({ id: 1, name: 'Test' });

      const result = await controller.create(dto);

      expect(mockPaymentsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, name: 'Test' });
    });
  });

  // FIND ALL
  describe('findAll', () => {
    it('should return all payment methods', async () => {
      mockPaymentsService.findAll.mockResolvedValue([{ id: 1 }]);

      const result = await controller.findAll();

      expect(mockPaymentsService.findAll).toHaveBeenCalled();
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  // FIND ONE
  describe('findOne', () => {
    it('should throw error if invalid id', async () => {
      (validateParameters as jest.Mock).mockReturnValue(false);

      await expect(controller.findOne('abc')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return item if found', async () => {
      (validateParameters as jest.Mock).mockReturnValue(true);

      mockPaymentsService.findOne.mockResolvedValue({ id: 1 });

      const result = await controller.findOne('1');

      expect(mockPaymentsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });

    it('should return message if not found', async () => {
      (validateParameters as jest.Mock).mockReturnValue(true);

      mockPaymentsService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('1');

      // 🔥 AJUSTE PARA COINCIDIR CON TU CONTROLLER REAL
      expect(result).toEqual('No existe el método de pago.');
    });
  });

  // UPDATE
  describe('update', () => {
    it('should call service.update with valid id', async () => {
      (validateParameters as jest.Mock).mockReturnValue(true);

      mockPaymentsService.update.mockResolvedValue({ id: 1, name: 'Updated' });

      const dto = { name: 'Updated' };
      const result = await controller.update('1', dto);

      expect(mockPaymentsService.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ id: 1, name: 'Updated' });
    });

    it('should throw if invalid id', async () => {
      (validateParameters as jest.Mock).mockReturnValue(false);

      await expect(controller.update('abc', {})).rejects.toThrow(
        'Parametros inválidos'
      );
    });
  });

  // DELETE
  describe('remove', () => {
    it('should call service.delete with valid id', async () => {
      (validateParameters as jest.Mock).mockReturnValue(true);

      mockPaymentsService.delete.mockResolvedValue({ deleted: true });

      const result = await controller.remove('1');

      expect(mockPaymentsService.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ deleted: true });
    });

    it('should throw if invalid id', async () => {
      (validateParameters as jest.Mock).mockReturnValue(false);

      await expect(controller.remove('abc')).rejects.toThrow(
        'Parametros inválidos'
      );
    });
  });
});
