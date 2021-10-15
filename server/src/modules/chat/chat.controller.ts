import { auth } from 'firebase-admin';
import { AuthUser } from './../../decorators/auth-user.decorator';
import { FirebaseAuthGuard } from './../../guards/firebase-auth.guard';
import { ChatService } from './chat.service';
import { Controller, UseGuards, Post, Body } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('notification')
  public async sendNotificationToDevices(
    @AuthUser() firebaseUser: auth.UserRecord,
    @Body('threadId') threadId: string,
    @Body('message') message: string,
  ): Promise<void> {
    return await this.chatService.sendNotificationToDevices(
      firebaseUser,
      threadId,
      message,
    );
  }
}
