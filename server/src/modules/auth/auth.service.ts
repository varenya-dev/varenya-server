import { UserService } from './../user/user.service';
import { FirebaseService } from './../firebase/firebase.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userServic: UserService,
  ) {}
}
