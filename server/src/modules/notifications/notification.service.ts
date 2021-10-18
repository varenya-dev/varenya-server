import { ChatNotificationDto } from './../../dto/notification/chat-notification.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { Injectable, Body } from '@nestjs/common';
import { auth } from 'firebase-admin';

@Injectable()
export class NotificationService {
  constructor(private readonly firebaseService: FirebaseService) {}

  public async handleChatNotifications(
    loggedInUser: auth.UserRecord,
    chatNotificationDto: ChatNotificationDto,
  ): Promise<void> {
    const thread = (
      await this.firebaseService.firebaseFirestore
        .collection('threads')
        .doc(chatNotificationDto.threadId)
        .get()
    ).data();

    const participants = thread['participants'];
    const filteredParticipants = participants.filter(
      (participant) => participant !== loggedInUser.uid,
    );
    const fcmTokens = await this.fetchFcmTokensByUserIds(filteredParticipants);
    await this.firebaseService.firebaseMessaging.sendToDevice(
      fcmTokens,
      {
        data: {
          thread: chatNotificationDto.threadId,
          type: 'chat',
        },
        notification: {
          title: `${loggedInUser.displayName} sent you a message!`,
          body: chatNotificationDto.message,
        },
      },
      {
        contentAvailable: true,
        priority: 'high',
      },
    );
  }

  private async fetchFcmTokensByUserIds(userIds: string[]): Promise<string[]> {
    const fcmTokens = [];

    const fcmTokensDocs = (
      await this.firebaseService.firebaseFirestore
        .collection('users')
        .where('id', 'in', userIds)
        .get()
    ).forEach((document) => {
      fcmTokens.push(document.data()['token']);
    });

    return fcmTokens;
  }
}
