import { auth } from 'firebase-admin';
import { User } from 'src/models/user.model';

export class LoggedInUser {
  public databaseUser: User;
  public firebaseUser: auth.UserRecord;

  constructor(databaseUser: User, firebaseUser: auth.UserRecord) {
    this.databaseUser = databaseUser;
    this.firebaseUser = firebaseUser;
  }
}
