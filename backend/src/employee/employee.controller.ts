import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeStatus } from '@prisma/client';
import { EmployeeQueryDto, UpdateSalaryDto } from './dto';

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

  @Patch(':id/salary')
  updateSalary(@Param('id') id: string, @Body() dto: UpdateSalaryDto) {
    console.log('Salary DTO:', dto);
    console.log('effectiveFrom:', dto.effectiveFrom);
    console.log('effectiveFrom type:', typeof dto.effectiveFrom);

    return this.employeeService.updateSalary(
      id,
      dto.amount,
      dto.currency,
      dto.effectiveFrom,
    );
  }
}
