import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { from } from 'rxjs';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user = new User();
  message: string = 'Login';
  guest: string = 'Guest';
  login = false;

  constructor(public _auth: Auth,
    public router: Router,
    public firestore: AngularFirestore,
    public msg: MatSnackBar,
    public auth: AngularFireAuth) { }

  /**
   * 
   * login function
   * @param userNames parameter for the username
   * @param password parameter for the password
   */
  signInUser(userNames: string, password: string) {
    return this.firestore.collection('users').valueChanges({ idField: 'id' }).subscribe((result) => {

      for (let i = 0; i < result.length; i++) {
        if ((result[i]['userName'] == userNames) && (result[i]['password'] == password)) {
          this.login = true;
          this.message = 'Logout';
          this.router.navigateByUrl(`/slack/${result[i]['id']}`);
        } else if (userNames != result[i]['userName']) {
          this.msg.open('User not found', 'Register please or Enter right Name');
        } else {
          this.msg.open('Wrong Password!', 'Register please or Enter right Password');
        }
      }
    });
  }

  /**
   * 
   * @param email for the email address
   * @param password for the password
   * @returns that will be return
   */
  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this._auth, email, password).then(() => {
      this.login = true;
      this.message = 'Logout';
    }));
  }

  /**
   * user can login as a guest
   * 
   */
  guestLogin() {
    this.firestore.collection('users').valueChanges({ idField: 'id' }).subscribe((result) => {
      for (let i = 0; i < result.length; i++) {
        if (result[i]['userName'] == this.guest) {
          this.login = true;
          this.message = 'Logout';
          this.router.navigateByUrl(`/slack/${result[i]['id']}`);
        }
      }
    });
  }

  /**
   * 
   * @param userId userId for the Slack Component you can show the username
   */
  getUser(userId) {
    if (userId) {
      this.firestore
        .collection('users')
        .doc(userId)
        .valueChanges()
        .subscribe((user: any) => {
          this.user = new User(user);
        });
    }
  }
}
