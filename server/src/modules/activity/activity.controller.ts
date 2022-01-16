import { RoleAuthGuard } from './../../guards/role-auth.guard';
import { ActivityService } from './activity.service';
import { Controller, UseGuards } from '@nestjs/common';

@Controller('activity')
@UseGuards(RoleAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
}
