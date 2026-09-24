import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const prismaMock = {
    employee: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);

    jest.clearAllMocks();
  });

  it('should return employee summary', async () => {
    prismaMock.employee.count
      .mockResolvedValueOnce(10000)
      .mockResolvedValueOnce(9500)
      .mockResolvedValueOnce(500);

    const result = await service.getSummary();

    expect(result).toEqual({
      total: 10000,
      active: 9500,
      inactive: 500,
    });
  });
});
