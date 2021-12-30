import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-slack-app',
  templateUrl: './slack-app.component.html',
  styleUrls: ['./slack-app.component.scss']
})
export class SlackAppComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
