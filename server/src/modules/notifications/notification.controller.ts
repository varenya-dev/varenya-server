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
  public async sendNotificationToDevices(
    @AuthUser() firebaseUser: auth.UserRecord,
    @Body('threadId') threadId: string,
    @Body('message') message: string,
  ): Promise<void> {
    return await this.notificationService.sendNotificationToDevices(
      firebaseUser,
      threadId,
      message,
    );
  }
}
