import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models/user.class';
import { AuthService } from '../services/auth.service';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'app-slack-app',
  templateUrl: './slack-app.component.html',
  styleUrls: ['./slack-app.component.scss'],
})
export class SlackAppComponent implements OnInit, AfterViewInit {
  userId = '';
  user: User = new User();

  @ViewChild('thread') thread: MatDrawer;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public threadService: ThreadService,
    public el: ElementRef
  ) {}

  ngAfterViewInit(): void {
    this.thread.opened = this.threadService.opened;
  }

  ngOnInit(): void {
    if (!this.authService.login) {
      this.router.navigateByUrl('/login');
    }
    this.route.paramMap.subscribe((paramMap) => {
      this.userId = paramMap.get('id');
      this.authService.getUser(this.userId);
    });
  }

  logOut() {
    this.router.navigateByUrl('/login');
    this.authService.login = false;
  }
}
