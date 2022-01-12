import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from 'src/models/user.class';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-slack-app',
  templateUrl: './slack-app.component.html',
  styleUrls: ['./slack-app.component.scss']
})
export class SlackAppComponent implements OnInit {

  userId = '';
  user: User = new User();

  constructor(public authService: AuthService, private router: Router, private route: ActivatedRoute, private firestore: AngularFirestore) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.userId = paramMap.get('id');
      this.getUser();
    });
    /* if(!this.authService.login){
      this.router.navigateByUrl('/');
    } */
  }

  getUser() {
    if (this.userId) {
      this.firestore
        .collection('users')
        .doc(this.userId)
        .valueChanges()
        .subscribe((user: any) => {
          this.user = new User(user);
        });
    }
  }

  logOut(){
    this.router.navigateByUrl('/');
    this.authService.login = false;
  }
}
