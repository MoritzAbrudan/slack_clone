import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DialogAddChannelComponent } from 'src/app/dialog-add-channel/dialog-add-channel.component';
import { Channel } from 'src/models/channel.class';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-channel-box',
  templateUrl: './channel-box.component.html',
  styleUrls: ['./channel-box.component.scss']
})
export class ChannelBoxComponent implements OnInit {
  channel = new Channel();
  dropdown = true;
  allChannels = [];

  constructor(private firestore: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.firestore
      .collection('channels')
      .valueChanges({idField: 'customIdName'})
      .subscribe((changes: any) => {
        this.allChannels = changes;
      });
  }

  openDialog(){
    this.dialog.open(DialogAddChannelComponent);
  }

}
