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
  login = false;

  constructor(public _auth: Auth, public firestore: AngularFirestore, public auth: AngularFireAuth) { }

  signIn(userName: string, password: string){
   return this.firestore.collection('users').doc().valueChanges({ idfield: 'customId' });
  }

  signUp(email: string, password: string){
    return from(createUserWithEmailAndPassword(this._auth, email, password).then(() =>{
      this.login = true;
      this.message = 'Logout';
    }));
  }

  signInGuest(){
    this.guest;
    this.login = true;
    this.message = 'Logout';
  }
  
  logout(){
    this._auth.signOut();
    this.login = false;
  }
}
