import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DialogAddChannelComponent } from 'src/app/dialog-add-channel/dialog-add-channel.component';
import { Channel } from 'src/models/channel.class';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouteConfigLoadEnd } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-channel-box',
  templateUrl: './channel-box.component.html',
  styleUrls: ['./channel-box.component.scss']
})
export class ChannelBoxComponent implements OnInit {
  channel = new Channel();
  dropdown = true;
  allChannels = [];

  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private route: ActivatedRoute, public channelService: ChannelService) { }

  async ngOnInit() {
    await this.firestore
      .collection('channels')
      .valueChanges({ idField: 'customIdChannel' })
      .subscribe((changes: any) => {
        this.allChannels = changes;
        this.channelService.channelID = changes.idField;
        console.log(this.allChannels);
      });
  }

  openDialog() {
    this.dialog.open(DialogAddChannelComponent);
  }

  openChannel() {
    console.log("Channel ID is ",this.channelService.channelID);
  }

}
