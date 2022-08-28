import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DialogAddChannelComponent } from 'src/app/dialog-add-channel/dialog-add-channel.component';
import { Channel } from 'src/models/channel.class';
import { MatDialog } from '@angular/material/dialog';
import { ChannelService } from 'src/app/services/channel.service';
import { Router } from '@angular/router';
import { ThreadService } from 'src/app/services/thread.service';

@Component({
  selector: 'app-channel-box',
  templateUrl: './channel-box.component.html',
  styleUrls: ['./channel-box.component.scss'],
})
export class ChannelBoxComponent implements OnInit {
  channel = new Channel();
  dropdown = true;
  allChannels = [];

  constructor(
    private firestore: AngularFirestore,
    public dialog: MatDialog,
    public channelService: ChannelService,
    public threadService: ThreadService
  ) {}

  async ngOnInit() {
    await this.firestore
      .collection('channels')
      .valueChanges({ idField: 'customIdChannel' })
      .subscribe((changes: any) => {
        this.allChannels = changes;
      });
  }

  openDialog() {
    this.dialog.open(DialogAddChannelComponent);
  }

  openChannel(i) {
    this.channelService.data$.next({
      channelTitle: this.allChannels[i]['title'],
      channelId: this.allChannels[i]['customIdChannel'],
    });
    return (this.threadService.opened = false);
  }

  seeDropdown() {
    this.dropdown = !this.dropdown;
  }
}
