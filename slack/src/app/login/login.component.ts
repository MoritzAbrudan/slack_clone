import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { user } from 'rxfire/auth';
import { User } from 'src/models/user.class';
import { AuthService } from '../services/auth.service';


/* export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
} */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /* matcher = new MyErrorStateMatcher(); */
  user = new User();
  loading = false;
  hide = true;
  hide1 = true;

  signInForm = new FormGroup({
    userNames: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    userNames: new FormControl('', Validators.required)
  });

  constructor(public router: Router,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private msg: MatSnackBar,
    public firestore: AngularFirestore,
    public auth: AngularFireAuth) { }

  ngOnInit(): void {
  }


  /**
   * check if the same password
   * 
   */
  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  get email() {
    //return this.signInForm.get('email');
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get userName() {
    return this.signInForm.get('userNames');
    return this.signUpForm.get('userNames');
  }

  /**
   * 
   * Login Function
   */
  async onSignIn() {
    this.loading = true;
    if (!this.signInForm.valid) {
      this.loading = false;
      return;
    }
    this.loginUser();
  }

  async loginUser() {
    const { userNames, password } = this.signInForm.value;
    this.authService.signInUser(userNames);
    await this.firestore.collection('users').valueChanges({ idField: 'id' }).subscribe((result) => {
      for (let i = 0; i < result.length; i++) {
        if (result[i]['userName'] == this.authService.signInUser(userNames)) {
          this.authService.login = true;
          this.authService.message = 'Logout';
          this.router.navigateByUrl(`/slack/${result[i]['id']}`);
        }
      }
      this.loading = false;
    }, (error) => {
      if (error.code === 'auth/wrong-password') this.msg.open('Wrong Password!', 'Try Again');
      else if (error.code === 'auth/user-not-found') this.msg.open('User not found', 'Register please');
      else this.msg.open(error, 'Close');
      this.loading = false;
    });
  }

  /**
   * User Registration
   * 
   */
  async onSignUp() {

    this.checkPasswords;
    this.loading = true;

    if (!this.signUpForm.valid) {
      this.loading = false;
      return;
    }

    this.createUser();
  }

  async createUser() {
    const { email, password, userNames } = this.signUpForm.value;

    await this.authService.signUp(email, password).subscribe(() => {
      this.firestore.collection('users').doc().set({
        userName: userNames,
        email: email,
        password: password
      });
      window.location.reload();
      this.loading = false;
    }, (error) => {
      if (error.code === 'auth/email-already-in-use') this.msg.open('E-Mail already in use', 'Try Again');
      else this.msg.open(error, 'Close');
      this.loading = false;
    });
  }

  async loginGuest() {
    await this.firestore.collection('users').valueChanges({ idField: 'id' }).subscribe((result) => {
      for (let i = 0; i < result.length; i++) {
        if (result[i]['userName'] == this.authService.guest) {
          this.authService.login = true;
          this.authService.message = 'Logout';
          this.router.navigateByUrl(`/slack/${result[i]['id']}`);
        }
      }
      this.loading = false;
    });

  }
}
