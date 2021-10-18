import { ChatNotificationDto } from './../../dto/notification/chat-notification.dto';
import { auth } from 'firebase-admin';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { FirebaseAuthGuard } from '../../guards/firebase-auth.guard';
import { NotificationService } from './notification.service';
import { Controller, UseGuards, Post, Body } from '@nestjs/common';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('chat')
  public async handleChatNotifications(
    @AuthUser() firebaseUser: auth.UserRecord,
    @Body() chatNotificationDto: ChatNotificationDto,
  ): Promise<void> {
    return await this.notificationService.handleChatNotifications(
      firebaseUser,
      chatNotificationDto,
    );
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('sos')
  public async handleSOSNotifications(
    @AuthUser() firebaseUser: auth.UserRecord,
  ): Promise<void> {
    return await this.notificationService.handleSOSNotifications(firebaseUser);
  }
}
