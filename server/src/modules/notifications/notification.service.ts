import { LoggedInUser } from 'src/dto/logged-in-user.dto';
import { ResponseNotificationDto } from './../../dto/notification/response-notification.dto';
import { ChatNotificationDto } from './../../dto/notification/chat-notification.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(private readonly firebaseService: FirebaseService) {}

  public async handleChatNotifications(
    loggedInUser: LoggedInUser,
    chatNotificationDto: ChatNotificationDto,
  ): Promise<void> {
    const filteredParticipants = await this.fetchParticipantsByThreads(
      chatNotificationDto.threadId,
      loggedInUser,
    );

    if (filteredParticipants.length === 0) {
      return;
    }

    await this.sendNotification(
      filteredParticipants,
      {
        thread: chatNotificationDto.threadId,
        type: 'chat',
      },
      {
        title: `${loggedInUser.firebaseUser.displayName} sent you a message!`,
        body: chatNotificationDto.message,
      },
    );
  }

  public async handleSOSNotifications(
    loggedInUser: LoggedInUser,
  ): Promise<void> {
    await this.firebaseService.firebaseMessaging.sendToTopic('sos', {
      data: {
        type: 'sos',
        userId: loggedInUser.firebaseUser.uid,
      },
      notification: {
        title: 'Someone is calling for help!',
        body: 'Tap this notification to help them!',
      },
    });
  }

  public async handleSOSResponseNotifications(
    responseNotificationDto: ResponseNotificationDto,
    loggedInUser: LoggedInUser,
  ): Promise<void> {
    const filteredParticipants = await this.fetchParticipantsByThreads(
      responseNotificationDto.threadId,
      loggedInUser,
    );

    await this.sendNotification(
      filteredParticipants,
      {
        type: 'chat',
        thread: responseNotificationDto.threadId,
      },
      {
        title: 'Someone replied!',
        body: 'Tap this notification to start a conversation.',
      },
    );
  }

  public async handleAppointmentCreationNotification(
    recipientId: string,
  ): Promise<void> {
    await this.sendNotification(
      [recipientId],
      {
        type: 'appointment',
      },
      {
        title: 'Someone requests for an appointment!',
        body: 'Tap this notification to confirm or cancel the appointment.',
      },
    );
  }

  public async handleAppointmentUpdateNotification(
    recipientId: string,
  ): Promise<void> {
    await this.sendNotification(
      [recipientId],
      {
        type: 'appointment',
      },
      {
        title: 'An update on one of your appointments!',
        body: 'Tap this notification to view the update.',
      },
    );
  }

  public async handleAppointmentDeleteNotification(
    recipientIds: string[],
  ): Promise<void> {
    await this.sendNotification(
      recipientIds,
      {
        type: 'appointment',
      },
      {
        title: 'Appointment Cancelled',
        body: 'Tap this notification to view.',
      },
    );
  }

  private async fetchParticipantsByThreads(
    threadId: string,
    loggedInUser: LoggedInUser,
  ): Promise<string[]> {
    const thread = (
      await this.firebaseService.firebaseFirestore
        .collection('threads')
        .doc(threadId)
        .get()
    ).data();

    const participants = thread['participants'];
    const filteredParticipants = participants.filter(
      (participant) => participant !== loggedInUser.firebaseUser.uid,
    );

    return filteredParticipants;
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

  private async sendNotification(
    recipientIds: string[],
    data: any,
    notification: { title: string; body: string },
  ): Promise<void> {
    const fcmTokens = await this.fetchFcmTokensByUserIds(recipientIds);

    if (fcmTokens.length === 0) {
      return;
    }

    await this.firebaseService.firebaseMessaging.sendToDevice(
      fcmTokens,
      {
        data: data,
        notification: notification,
      },
      {
        contentAvailable: true,
        priority: 'high',
      },
    );
  }
}
