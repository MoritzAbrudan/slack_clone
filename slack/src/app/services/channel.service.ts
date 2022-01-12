import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  
  public data$: BehaviorSubject<any> = new BehaviorSubject('');

  constructor() { }
}
