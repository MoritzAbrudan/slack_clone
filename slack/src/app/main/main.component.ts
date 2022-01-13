import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {ActivatedRoute} from '@angular/router';
import {FileUploadService} from 'src/app/services/file-upload.service';
import {FileUpload} from 'src/models/file-upload.model';
import {Message} from 'src/models/message.class';
import {ChannelService} from '../services/channel.service';

import {addDoc, collection, getFirestore} from "@angular/fire/firestore";

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

  fileUpload!: FileUpload;
  files;

  constructor(private uploadService: FileUploadService,
              private fileList: FileUploadService, //?????????
              private route: ActivatedRoute,
              private firestore: AngularFirestore,
              public channelService: ChannelService) {
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
          this.question = msg;
          this.show = true;
        });
    });

  }

  setMessage(value) {
    this.message.question = value;
  }

  saveMessage() {
    if (this.selectedFiles) {
      this.upload()
    }
    this.saveMessageToFirestore()
  }

  async saveMessageToFirestore() {
    console.log('channel', this.channel)
    console.log('message', this.message.toJSON())
    const docRef = await addDoc(collection(getFirestore(), `channels/${this.channel['channelId']}/messages`), this.message.toJSON())
    console.log('message id', docRef.id)
  }

  /*getFilesFromFire() {
    this.files =this.fileList.getFiles(1);
    console.log(this.files)
  }*/

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
