import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EmployeeService', () => {
  let service: EmployeeService;

  const prismaMock = {
    employee: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    salaryRecord: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should apply employee search and filters', async () => {
    prismaMock.employee.findMany.mockResolvedValue([]);
    prismaMock.employee.count.mockResolvedValue(0);

    await service.findAll(1, 10, 'Aarav', 'India', 'Human Resources', 'ACTIVE');

    expect(prismaMock.employee.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where: expect.objectContaining({
          country: 'India',
          department: 'Human Resources',
          status: 'ACTIVE',
        }),
      }),
    );
  });

  it('should create a new salary record', async () => {
    prismaMock.salaryRecord.create.mockResolvedValue({
      id: 'salary-1',
      employeeId: 'employee-1',
      amount: 80000,
      currency: 'INR',
      effectiveFrom: new Date('2026-10-01'),
    });

    const result = await service.updateSalary(
      'employee-1',
      80000,
      'INR',
      new Date('2026-10-01'),
    );

    expect(prismaMock.salaryRecord.create).toHaveBeenCalledWith({
      data: {
        employeeId: 'employee-1',
        amount: 80000,
        currency: 'INR',
        effectiveFrom: new Date('2026-10-01'),
      },
    });

    expect(result).toBeDefined();
  });
});
