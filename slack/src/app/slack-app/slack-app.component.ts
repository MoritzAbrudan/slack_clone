import { AfterViewInit, Component, Directive, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models/user.class';
import { AuthService } from "../services/auth.service";
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'app-slack-app',
  templateUrl: './slack-app.component.html',
  styleUrls: ['./slack-app.component.scss']
})

export class SlackAppComponent implements OnInit, AfterViewInit {

  userId = '';
  user: User = new User();

  @ViewChild('thread') thread: MatDrawer;

  constructor(public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              public threadService: ThreadService) {
  }

  ngAfterViewInit(): void {
    this.thread.opened = this.threadService.opened;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.userId = paramMap.get('id');
      this.authService.getUser(this.userId);
    })
    /* if (!this.authService.login) {
      this.router.navigateByUrl('/');
    } */ 
  }

  logOut() {
    this.router.navigateByUrl('/');
    this.authService.login = false;
  }

}
