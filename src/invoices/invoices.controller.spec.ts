import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { EmailService } from './../email.service';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  const mockInvoicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: mockInvoicesService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService
        }
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service with the correct data', async () => {
      const invoiceDto = { customer: 'Example Customer', amount: 100 };
      mockInvoicesService.create.mockResolvedValue({
        id: '123',
        ...invoiceDto,
      });

      const result = await controller.create(invoiceDto);

      expect(service.create).toHaveBeenCalledWith(invoiceDto);
      expect(result).toEqual({ id: '123', ...invoiceDto });
    });
  });

  describe('findAll', () => {
    it('should call the service with query parameters', async () => {
      const query = { customer: 'Example Customer' };
      const invoices = [
        { id: '123', customer: 'Example Customer', amount: 100 },
      ];
      mockInvoicesService.findAll.mockResolvedValue(invoices);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(invoices);
    });

    it('should call the service with a date range', async () => {
      const query = {
        startDate: '2024-12-01',
        endDate: '2024-12-31',
      };

      const mockInvoices = [
        { id: '123', customer: 'John Doe', amount: 100, date: '2024-12-10' },
        { id: '124', customer: 'Jane Doe', amount: 200, date: '2024-12-15' },
        { id: '125', customer: 'Jim Beam', amount: 300, date: '2024-11-25' },
        { id: '126', customer: 'Jack Daniels', amount: 400, date: '2025-01-05' },
      ];
  
      const expectedResult = [
        { id: '123', customer: 'John Doe', amount: 100, date: '2024-12-10' },
        { id: '124', customer: 'Jane Doe', amount: 200, date: '2024-12-15' },
      ];

      mockInvoicesService.findAll.mockResolvedValue(
        mockInvoices.filter(
          (invoice) =>
            new Date(invoice.date) >= new Date(query.startDate) &&
            new Date(invoice.date) <= new Date(query.endDate),
        ),
      );

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getInvoiceById', () => {
    it('should call the service with the correct ID', async () => {
      const id = '123';
      const invoice = { id: '123', customer: 'Example Customer', amount: 100 };
      mockInvoicesService.findOneById.mockResolvedValue(invoice);

      const result = await controller.getInvoiceById(id);

      expect(service.findOneById).toHaveBeenCalledWith(id);
      expect(result).toEqual(invoice);
    });
  });
});
