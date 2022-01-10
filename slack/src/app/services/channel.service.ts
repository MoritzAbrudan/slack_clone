import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  channelID: string = '';

  getChannel(){
    return this.channelID;
  }

  constructor() { }
}
