import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  public data$: BehaviorSubject<any> = new BehaviorSubject({channelTitle: 'Developer Akademie', channelId: 'BNVLBgmTtk12n8Iv6qzX'});

  constructor() { }
}
