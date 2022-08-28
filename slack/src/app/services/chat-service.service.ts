import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  channel: any;
  chat: string;
  public chatData$: BehaviorSubject<any> = new BehaviorSubject('');
  constructor(
    private firestore: AngularFirestore,
    private channelService: ChannelService
  ) {}

  deleteChat(): void {
    this.channelService.data$.subscribe((data) => {
      this.channel = data;
      this.chatData$.subscribe((chatData) => {
        this.chat = chatData;
        this.firestore
          .collection(`channels/${this.channel['channelId']}/messages`)
          .doc(this.chat['messageID']['messageId'])
          .delete();
      });
    });
  }
}
