import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';

import {FileUploadService} from 'src/app/services/file-upload.service';
import {FileUpload} from 'src/models/file-upload.model';
import {Message} from 'src/models/message.class';
import {ChannelService} from '../services/channel.service';

import {ThreadService} from "../services/thread.service";
import {User} from 'src/models/user.class';
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  imgSrc: string = ''
  selectedImage: any = null;

  channel = '';
  questions = [];
  show = false;
  newMessage = new Message();
  user: User = new User();

  fileUpload!: FileUpload;
  files;


  constructor(private uploadService: FileUploadService,
              private fileList: FileUploadService, //?????????
              private authService: AuthService,
              public firestore: AngularFirestore,
              public channelService: ChannelService,
              public threadService: ThreadService) {
  }

  ngOnInit(): void {
    this.getChannel();
  }

  getChannel() {
    this.channelService.data$.subscribe((data) => {
      this.channel = data;
      this.firestore
        .collection(`channels/${this.channel['channelId']}/messages`)
        .valueChanges()
        .subscribe((msg: any) => {
          this.questions = msg;
          this.show = true;
        });
    });
  }

  goToThread(message) {
    console.log('goToThread message=', message)
    this.threadService.opened = true          //open Thread
  }

  /**
   * Show Date and Time for showing at message
   * @param {number} time uploadTime of message
   * @return {string} eg. 2021-01-16 09:41
   */
  uploadTimeToMessageTime(time) {
    const isoTime = new Date(time).toISOString()
    const date = isoTime.slice(0, 10);
    const timeString = isoTime.slice(11, 16)
    return date + ' / ' + timeString
  }

  setMessage(value) {
    this.newMessage.question = value;
  }

  /**
   * Save Message and Upload files by clicking send button
   * Only working if something is written in input field.
   */
  saveMessage() {
    if (this.newMessage.question.length > 0) {
      if (this.selectedFiles) {
        this.upload()
        this.saveMessageToFirestore()
      } else {
        this.saveMessageToFirestore()
      }
    }
  }

  /**
   * Save Message in Firestore in collection messages
   */
  async saveMessageToFirestore() {
    const actualTime = new Date().getTime()
    await this.firestore.collection(`channels/${this.channel['channelId']}/messages`)
      .doc(actualTime.toString())  // Time as DocumentId
      .set({
        uploadTime: actualTime,
        question: this.newMessage.question,
        user: this.authService.user.userName
      });
  }

  /**
   * Save selected File in variable selectedFiles
   * @param event
   */
  selectFile(event: any): void {
    console.log(event)
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      this.selectedFiles = event.target.files;
    } else {
      this.selectedImage = null;
    }
  }

  /**
   * Upload File in selectedFiles to Firestore and delete selectedFiles
   */
  upload(): void {
    const file: File | null = this.selectedFiles.item(0);
    if (file) {
      this.currentFileUpload = new FileUpload(file);
      this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
        percentage => {
          this.percentage = Math.round(percentage ? percentage : 0);
          if (percentage == 100) {
            setTimeout(() => this.percentage = 0, 1000);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
    this.selectedFiles = undefined;
  }

}
