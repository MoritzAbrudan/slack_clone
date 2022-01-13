import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {ActivatedRoute} from '@angular/router';
import {FileUploadService} from 'src/app/services/file-upload.service';
import {FileUpload} from 'src/models/file-upload.model';
import {Message} from 'src/models/message.class';
import {ChannelService} from '../services/channel.service';

import {addDoc, collection, doc, getDoc, getDocFromServer, getFirestore} from "@angular/fire/firestore";
import {ThreadService} from "../services/thread.service";
import {log} from "util";

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
  questions = [];
  show = false;
  newMessage = new Message();

  fileUpload!: FileUpload;
  files;

  constructor(private uploadService: FileUploadService,
              private fileList: FileUploadService, //?????????
              private route: ActivatedRoute,
              private firestore: AngularFirestore,
              public channelService: ChannelService,
              public threadService: ThreadService) {
  }

  ngOnInit(): void {
    this.getChannel();
  }

  getChannel() {
    this.channelService.data$.subscribe((data) => {
      console.log(data)
      this.channel = data;
      this.firestore
        .collection(`channels/${this.channel['channelId']}/messages`)
        .valueChanges()
        .subscribe((msg: any) => {
          console.log(msg);
          this.questions = msg;
          this.show = true;
        });
    });
  }

  goToThread(message) {
    console.log('goToThread message=', message)
    this.threadService.opened = true          //open Thread
  }

  setMessage(value) {
    this.newMessage.question = value;
  }

  saveMessage() {
    if (this.selectedFiles) {
      this.upload()
    }
    this.saveMessageToFirestore()
      .then(() => console.log('Message in Firestore gespeichert'))
  }

  async saveMessageToFirestore() {
    await addDoc(collection(getFirestore(), `channels/${this.channel['channelId']}/messages`), this.newMessage.toJSON())
  }

  // Fire Storage
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles)
  }

  upload(): void {
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
