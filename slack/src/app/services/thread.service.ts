import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  opened: boolean = false;
  public data$: BehaviorSubject<any> = new BehaviorSubject('');

  constructor() { }
}
