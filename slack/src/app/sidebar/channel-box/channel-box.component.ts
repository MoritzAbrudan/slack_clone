import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-channel-box',
  templateUrl: './channel-box.component.html',
  styleUrls: ['./channel-box.component.scss']
})
export class ChannelBoxComponent implements OnInit {
  channel = new Channel();
  dropdown = true;
  allChannels = [];

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.firestore
      .collection('channels')
      .valueChanges({idField: 'customIdChannel'})
      .subscribe((changes: any) => {
        this.allChannels = changes;
      });
  }

}
