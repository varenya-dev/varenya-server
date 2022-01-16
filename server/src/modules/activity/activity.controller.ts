import { RoleAuthGuard } from './../../guards/role-auth.guard';
import { ActivityService } from './activity.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { Activity } from 'src/models/activity.model';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';

@Controller('activity')
@UseGuards(RoleAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @Role(Roles.Main)
  public async fetchActivity(
    @AuthUser() loggedInUser: LoggedInUser,
  ): Promise<Activity[]> {
    return await this.activityService.fetchActivity(loggedInUser);
  }
}
