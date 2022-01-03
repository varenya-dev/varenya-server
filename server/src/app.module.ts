import { CommentsModule } from './modules/comments/comments.module';
import { PostModule } from './modules/post/post.module';
import { PostImage } from './models/post-image.model';
import { PostCategory } from './models/post-category.model';
import { DoctorModule } from './modules/doctor/doctor.module';
import { Specialization } from './models/specialization.model';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { Appointment } from './models/appointment.model';
import { NotificationModule } from './modules/notifications/notification.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { Doctor } from './models/doctor.model';
import { Post } from './models/post.model';
import { RandomName } from './models/random-name.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: true,
      entities: [
        User,
        Appointment,
        Specialization,
        Doctor,
        PostCategory,
        PostImage,
        Post,
        RandomName,
      ],
    }),
    FirebaseModule,
    UserModule,
    AuthModule,
    NotificationModule,
    AppointmentModule,
    DoctorModule,
    PostModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
