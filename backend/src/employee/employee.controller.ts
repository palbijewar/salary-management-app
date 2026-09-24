import { Controller, Get, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeStatus } from '@prisma/client';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('country') country?: string,
    @Query('department') department?: string,
    @Query('status') status?: EmployeeStatus,
  ) {
    return this.employeeService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
      search,
      country,
      department,
      status,
    );
  }
}
