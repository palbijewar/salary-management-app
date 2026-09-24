/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeStatus } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page = 1,
    limit = 20,
    search?: string,
    country?: string,
    department?: string,
    status?: EmployeeStatus,
  ) {
    const skip = (page - 1) * limit;

    const where = {
      ...(search
        ? {
            OR: [
              {
                firstName: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                lastName: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                employeeCode: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
      ...(country ? { country } : {}),
      ...(department ? { department } : {}),
      ...(status ? { status } : {}),
    };

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        orderBy: {
          employeeCode: 'asc',
        },
        skip,
        take: limit,
        include: {
          salaries: {
            orderBy: {
              effectiveFrom: 'desc',
            },
            take: 1,
          },
        },
      }),
      this.prisma.employee.count({ where }),
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

  async getSalaryHistory(employeeId: string) {
    return this.prisma.salaryRecord.findMany({
      where: {
        employeeId,
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.employee.findUnique({
      where: {
        id,
      },
      include: {
        salaries: {
          orderBy: {
            effectiveFrom: 'desc',
          },
          take: 1,
        },
      },
    });
  }
}
