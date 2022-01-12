import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FileUpload } from 'src/models/file-upload.model';
import { Message } from 'src/models/message.class';
import { ChannelService } from '../services/channel.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;

  channel = '';
  question = [];
  show = false;
  message = new Message();

  constructor(private uploadService: FileUploadService, private route: ActivatedRoute, private firestore: AngularFirestore, public channelService: ChannelService) {
  }

  ngOnInit(): void {

    this.getChannel();
  }

  getChannel() {
    this.channelService.data$.subscribe((data) => {
      this.channel = data;
      console.log(this.channel);

      this.firestore
        .collection('messages')
        .valueChanges()
        .subscribe((msg: any) => {
          console.log(msg);
          for (let i = 0; i < msg.length; i++) {
            if (msg[i]['channel'] == this.channel) {
              console.log(this.channel);
              this.question = msg;
              this.show = true;
            } else{
              this.show = false;
            }
          }

        });

    });
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles)
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
          percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
          },
          error => {
            console.log(error);
          }
        );
      }
    }

  }
}
