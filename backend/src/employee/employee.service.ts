import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        orderBy: {
          employeeCode: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.employee.count(),
    ]);

    return {
      data: employees,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
