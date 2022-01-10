import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  channelID;

  getChannel(){
    return this.channelID;
  }

  constructor() { }
}
