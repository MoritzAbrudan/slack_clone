import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public _auth: Auth) { }

  signIn(username: string, password: string){
   return from(signInWithEmailAndPassword(this._auth, username, password));
  }

  signUp(username: string, password: string){
    return from(createUserWithEmailAndPassword(this._auth, username, password));
  }
  
  logout(){
    this._auth.signOut();
    localStorage.removeItem('user');
  }
}
