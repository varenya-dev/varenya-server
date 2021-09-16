import { FirebaseModule } from './../firebase/firebase.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [FirebaseModule],
})
export class AuthModule {}
