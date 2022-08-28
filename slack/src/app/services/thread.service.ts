import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/models/message.class';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  opened: boolean = false;
  public data$: BehaviorSubject<any> = new BehaviorSubject('');
  thread = '';
  channel = '';
  question = new Message();

  constructor(
    public channelService: ChannelService,
    private firestore: AngularFirestore
  ) {}

  getQuestion() {
    this.channelService.data$.subscribe((channelData) => {
      this.channel = channelData;
      this.data$.subscribe((threadData) => {
        this.thread = threadData;
        this.firestore
          .collection(`channels/${this.channel['channelId']}/messages`)
          .doc(this.thread['messageID'])
          .valueChanges()
          .subscribe((msg: any) => {
            //console.log('getQueston', msg);
            this.question = msg;
          });
      });
    });
  }
}
