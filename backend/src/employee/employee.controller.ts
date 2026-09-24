import { Controller, Get, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.employeeService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }
}
