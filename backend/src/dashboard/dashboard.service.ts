import { Injectable } from '@nestjs/common';
import { EmployeeStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [total, active, inactive] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.employee.count({
        where: { status: EmployeeStatus.ACTIVE },
      }),
      this.prisma.employee.count({
        where: { status: EmployeeStatus.INACTIVE },
      }),
    ]);

    return {
      total,
      active,
      inactive,
    };
  }
}
