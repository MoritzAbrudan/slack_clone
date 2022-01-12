import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { from } from 'rxjs';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new User();
  message: string = 'Login';
  guest: string = 'Guest';
  login = true;

  constructor(public _auth: Auth, public firestore: AngularFirestore, public auth: AngularFireAuth) { }

  signInUser(userNames: string){
    return userNames;
  }

  signUp(email: string, password: string){
    return from(createUserWithEmailAndPassword(this._auth, email, password).then(() =>{
      this.login = true;
      this.message = 'Logout';
    }));
  }
}
