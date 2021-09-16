import { FirebaseService } from '../firebase/firebase.service';
import { Module } from '@nestjs/common';
import { DummyController } from './dummy.controller';
import { DummyService } from './dummy.service';

@Module({
  imports: [FirebaseService],
  controllers: [DummyController],
  providers: [DummyService],
})
export class DummyModule {}
