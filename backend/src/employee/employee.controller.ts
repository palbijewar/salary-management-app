import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
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
  async findOne(@Param('id') id: string) {
    const employee = await this.employeeService.findOne(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }
}
