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

  it('should return paginated employees', async () => {
    prismaMock.employee.findMany.mockResolvedValue([
      {
        id: '1',
        employeeCode: 'EMP00001',
        firstName: 'Aarav',
        lastName: 'Verma',
        salaries: [],
      },
    ]);

    prismaMock.employee.count.mockResolvedValue(100);

    const result = await service.findAll(2, 10);

    expect(result.meta).toEqual({
      page: 2,
      limit: 10,
      total: 100,
      totalPages: 10,
    });

    expect(result.data).toHaveLength(1);

    expect(prismaMock.employee.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 10,
      }),
    );
  });
});
