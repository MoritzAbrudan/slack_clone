import {Component, OnInit} from '@angular/core';
import {FileUpload} from 'src/models/file-upload.model';
import {FileUploadService} from '../services/file-upload.service';
import {ThreadService} from '../services/thread.service';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ChannelService} from "../services/channel.service";

@Component({
  selector: 'app-threat-bar',
  templateUrl: './threat-bar.component.html',
  styleUrls: ['./threat-bar.component.scss']
})
export class ThreatBarComponent implements OnInit {

  thread = '';
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;

  constructor(private uploadService: FileUploadService,
              public threadService: ThreadService,
              public channelService: ChannelService,
              private firestore: AngularFirestore) {
  }

  ngOnInit(): void {
    this.getThread()
  }

  //TODO
  getThread() {
    this.channelService.data$.subscribe((channelData) => {
      this.threadService.data$.subscribe((threadData) => {
        console.log(threadData)
        this.thread = threadData;
        this.firestore
          .collection(`channels/${channelData['channelId']}/messages/${this.thread['messageId']}/threads`)
          .valueChanges()
          .subscribe((msg: any) => {
            console.log(msg);
            /*this.questions = msg;
            this.show = true;*/
          });
      });
    })
  }

  // FireStorage
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

  closeThread() {
    this.threadService.opened = false;
  }

}
