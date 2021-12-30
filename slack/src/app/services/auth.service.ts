import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  message: string = 'Login';
  login = false;

  constructor(public _auth: Auth) { }

  signIn(username: string, password: string){
   return from(signInWithEmailAndPassword(this._auth, username, password).then(() =>{
     this.login = true;
     this.message = 'Logout';
   }));
  }

  signUp(username: string, password: string){
    return from(createUserWithEmailAndPassword(this._auth, username, password).then(() =>{
      this.login = true;
      this.message = 'Logout';
    }));
  }
  
  logout(){
    this._auth.signOut();
    this.login = false;
  }
}
