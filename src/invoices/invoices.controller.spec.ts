import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  beforeEach(async () => {
    const mockInvoicesService = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: mockInvoicesService,
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  describe('create', () => {
    it('should call InvoicesService.create and return the result', async () => {
      const mockInvoiceDto = { customer: 'John Doe', amount: 100 };
      const mockResult = { id: '1', ...mockInvoiceDto };

      jest.spyOn(service, 'create').mockResolvedValue(mockResult);

      const result = await controller.create(mockInvoiceDto);

      expect(service.create).toHaveBeenCalledWith(mockInvoiceDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should call InvoicesService.findAll and return the result', async () => {
      const mockInvoices = [
        { id: '1', customer: 'John Doe', amount: 100 },
        { id: '2', customer: 'Jane Doe', amount: 200 },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockInvoices);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockInvoices);
    });
  });
});
