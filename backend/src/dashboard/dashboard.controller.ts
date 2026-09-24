import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('by-country')
  getByCountry() {
    return this.dashboardService.getByCountry();
  }

  @Get('by-department')
  getByDepartment() {
    return this.dashboardService.getByDepartment();
  }
}
