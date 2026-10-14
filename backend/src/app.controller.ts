import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpGuard } from './guards/http.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(HttpGuard)
  @Get('test-notifications')
  testNotification(): string {
    return this.appService.testNotifications();
  }
}
