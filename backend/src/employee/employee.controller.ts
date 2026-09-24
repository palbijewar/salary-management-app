import { Controller, Get, Param, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeStatus } from '@prisma/client';
import { EmployeeQueryDto } from './dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll(@Query() query: EmployeeQueryDto) {
    return this.employeeService.findAll(
      query.page,
      query.limit,
      query.search,
      query.country,
      query.department,
      query.status,
    );
  }

  @Get(':id/salary-history')
  getSalaryHistory(@Param('id') id: string) {
    return this.employeeService.getSalaryHistory(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }
}
