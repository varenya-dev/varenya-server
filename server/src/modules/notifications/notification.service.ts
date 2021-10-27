import { ResponseNotificationDto } from './../../dto/notification/response-notification.dto';
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

  public async handleSOSNotifications(
    loggedInUser: auth.UserRecord,
  ): Promise<void> {
    await this.firebaseService.firebaseMessaging.sendToTopic('sos', {
      data: {
        type: 'sos',
        userId: loggedInUser.uid,
      },
      notification: {
        title: 'Someone is calling for help!',
        body: 'Tap this notification to help them!',
      },
    });
  }

  public async handleSOSResponseNotifications(
    responseNotificationDto: ResponseNotificationDto,
    loggedInUser: auth.UserRecord,
  ): Promise<void> {
    const thread = (
      await this.firebaseService.firebaseFirestore
        .collection('threads')
        .doc(responseNotificationDto.threadId)
        .get()
    ).data();

    const participants = thread['participants'];
    const filteredParticipants = participants.filter(
      (participant) => participant !== loggedInUser.uid,
    );
    const fcmTokens = await this.fetchFcmTokensByUserIds(filteredParticipants);

    await this.firebaseService.firebaseMessaging.sendToDevice(fcmTokens, {
      data: {
        type: 'chat',
        thread: responseNotificationDto.threadId,
      },
      notification: {
        title: 'Someone replied!',
        body: 'Tap this notification to start a conversation.',
      },
    });
  }

  private async fetchFcmTokensByUserIds(userIds: string[]): Promise<string[]> {
    const fcmTokens = [];

    const fcmTokensDocs = await this.firebaseService.firebaseFirestore
      .collection('users')
      .where('id', 'in', userIds)
      .get();

    fcmTokensDocs.forEach((document) => {
      fcmTokens.push(document.data()['token']);
    });

    return fcmTokens;
  }

  public async handleAppointmentCreationNotification(
    recipientId: string,
  ): Promise<void> {
    const fcmTokenDoc = await this.firebaseService.firebaseFirestore
      .collection('users')
      .doc(recipientId)
      .get();
    const fcmToken = fcmTokenDoc.data()['token'];

    await this.firebaseService.firebaseMessaging.sendToDevice(fcmToken, {
      data: {
        type: 'appointment',
      },
      notification: {
        title: 'Someone requests for an appointment!',
        body: 'Tap this notification to confirm or cancel the appointment.',
      },
    });
  }
}
