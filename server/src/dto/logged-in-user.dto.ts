import { auth } from 'firebase-admin';
import { User } from 'src/models/user.model';

export class LoggedInUser {
  public databaseUser?: User;
  public firebaseUser: auth.UserRecord;

  constructor(firebaseUser: auth.UserRecord, databaseUser?: User) {
    this.databaseUser = databaseUser;
    this.firebaseUser = firebaseUser;
  }
}
