import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  loading = false;
  hide = true;
  hide1 = true;

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  });

  constructor( public router: Router, private authService: AuthService,  public formBuilder: FormBuilder, private msg: MatSnackBar) { }

  ngOnInit(): void {
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  get email() {
    return this.signInForm.get('email');
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
    return this.signUpForm.get('password');
  }

  async onSignIn() {
    this.loading = true;
    if (!this.signInForm.valid) {
      return;
    }

    const { email, password } = this.signInForm.value;
    await this.authService.signIn(email, password).subscribe(() => {
      this.router.navigateByUrl('/slack');
      this.loading = false;
    }, (error) =>{
      this.msg.open(error, 'Close');
      this.loading = false;
    });
  }

  async onSignUp(): Promise<void> {
    this.checkPasswords;
    this.loading = true;
    if (!this.signUpForm.valid) {
      return;
    }

    const { email, password  } = this.signUpForm.value;
    await this.authService.signUp(email, password).subscribe(() => {
      this.router.navigateByUrl('/slack');
      this.loading = false;
    });
  }
}
