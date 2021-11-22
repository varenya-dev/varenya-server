import { RoleAuthGuard } from 'src/guards/role-auth.guard';
import { ResponseNotificationDto } from './../../dto/notification/response-notification.dto';
import { ChatNotificationDto } from './../../dto/notification/chat-notification.dto';
import { auth } from 'firebase-admin';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { NotificationService } from './notification.service';
import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/enum/roles.enum';

@UseGuards(RoleAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('chat')
  @Role(Roles.Main, Roles.Professional)
  public async handleChatNotifications(
    @AuthUser() firebaseUser: auth.UserRecord,
    @Body() chatNotificationDto: ChatNotificationDto,
  ): Promise<void> {
    return await this.notificationService.handleChatNotifications(
      firebaseUser,
      chatNotificationDto,
    );
  }

  @Post('sos')
  @Role(Roles.Main)
  public async handleSOSNotifications(
    @AuthUser() firebaseUser: auth.UserRecord,
  ): Promise<void> {
    return await this.notificationService.handleSOSNotifications(firebaseUser);
  }

  @Post('sos/response')
  @Role(Roles.Main, Roles.Professional)
  public async handleSOSResponseNotifications(
    @AuthUser() firebaseUser: auth.UserRecord,
    @Body() responseNotificationDto: ResponseNotificationDto,
  ): Promise<void> {
    return await this.notificationService.handleSOSResponseNotifications(
      responseNotificationDto,
      firebaseUser,
    );
  }
}
